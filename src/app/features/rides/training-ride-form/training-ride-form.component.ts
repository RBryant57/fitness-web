import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, filter, of, switchMap } from 'rxjs';

import { RidesService } from '../../../core/services/rides.service';
import { BikesService } from '../../../core/services/bikes.service';
import { RouteService } from '../../../core/services/route.service';
import { Bike } from '../../../core/models/equipment.model';
import { Route } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { GpxUploadComponent } from '../../../shared/components/gpx-upload/gpx-upload.component';
import { nowDatetimeLocal, roundTo, toDateInput, toDatetimeLocal } from '../../../shared/utils/format.util';
import { GpxSummary, secondsToHms } from '../../../shared/utils/gpx-parser.util';

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

@Component({
  selector: 'app-training-ride-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent, GpxUploadComponent],
  templateUrl: './training-ride-form.component.html'
})
export class TrainingRideFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ridesService = inject(RidesService);
  private bikesService = inject(BikesService);
  private routeService = inject(RouteService);
  private router = inject(Router);

  bikes: Bike[] = [];
  routes: Route[] = [];
  windDirections = WIND_DIRECTIONS;
  submitting = false;
  error: string | null = null;
  gpx: string | null = null;

  /** Distance from the most recently uploaded GPX file, used to derive EndOdometer
   *  once a start odometer reading is known (from either direction of entry order). */
  private gpxDistanceMiles: number | null = null;

  form = this.fb.nonNullable.group({
    ExerciseDate: ['', Validators.required],
    // Defaulted to "now" (with seconds) so the field is never left blank —
    // native datetime-local inputs report an empty value until every
    // segment, including AM/PM, has been filled in by the user.
    StartTime: [nowDatetimeLocal(), Validators.required],
    EndTime: [nowDatetimeLocal(), Validators.required],
    EquipmentId: [null as number | null, Validators.required],
    RouteId: [null as number | null, Validators.required],
    StartOdometer: [0, Validators.required],
    EndOdometer: [0, Validators.required],
    RideTimeHours: [0, Validators.required],
    RideTimeMinutes: [0, Validators.required],
    RideTimeSeconds: [0, Validators.required],
    Quantity: [null as number | null],
    MaxSpeed: [0],
    AverageHr: [0],
    MaxHr: [0],
    AverageCadence: [0],
    ElevationGain: [0],
    WindSpeed: [0],
    WindDirection: [''],
    Temperature: [0],
    Precipitation: [false],
    NumberOfAttempts: [0],
    NumberOfSuccesses: [0],
    Notes: ['']
  });

  ngOnInit(): void {
    this.bikesService.getAll().subscribe(bikes => (this.bikes = bikes));
    this.routeService.getAll().subscribe(routes => (this.routes = routes));

    // When a bike is selected, look up its current odometer reading and
    // use it to pre-fill the start odometer for this ride.
    this.form
      .get('EquipmentId')!
      .valueChanges.pipe(
        filter((id): id is number => id !== null),
        switchMap(id => this.bikesService.getMaxOdometer(id).pipe(catchError(() => of(null))))
      )
      .subscribe(max => {
        if (max !== null) {
          this.form.patchValue({ StartOdometer: max });
          this.applyEndOdometer();
        }
      });
  }

  onGpxLoaded(gpx: string | null): void {
    this.gpx = gpx;
  }

  /** Pre-fills form fields from a parsed GPX file. Only touches fields the
   *  track actually has data for — equipment, route, weather, crossing
   *  counts, and notes still need to be entered by hand. */
  onGpxSummary(summary: GpxSummary | null): void {
    if (!summary) {
      this.gpxDistanceMiles = null;
      return;
    }

    if (summary.startTime) {
      this.form.patchValue({
        ExerciseDate: toDateInput(summary.startTime.toISOString()),
        StartTime: toDatetimeLocal(summary.startTime.toISOString())
      });
    }
    if (summary.endTime) {
      this.form.patchValue({ EndTime: toDatetimeLocal(summary.endTime.toISOString()) });
    }
    if (summary.distanceMiles !== null) {
      this.form.patchValue({ Quantity: roundTo(summary.distanceMiles, 2) });
    }
    if (summary.maxSpeedMph !== null) {
      this.form.patchValue({ MaxSpeed: roundTo(summary.maxSpeedMph, 1) });
    }
    if (summary.averageHr !== null) {
      this.form.patchValue({ AverageHr: roundTo(summary.averageHr) });
    }
    if (summary.maxHr !== null) {
      this.form.patchValue({ MaxHr: roundTo(summary.maxHr) });
    }
    if (summary.averageCadence !== null) {
      this.form.patchValue({ AverageCadence: roundTo(summary.averageCadence) });
    }
    if (summary.elevationGainFeet !== null) {
      this.form.patchValue({ ElevationGain: roundTo(summary.elevationGainFeet) });
    }
    if (summary.temperatureF !== null) {
      this.form.patchValue({ Temperature: roundTo(summary.temperatureF) });
    }
    // This form has a single required ride-time field (no separate
    // moving/elapsed split), so use the full elapsed duration of the track.
    if (summary.elapsedSeconds !== null) {
      const { hours, minutes, seconds } = secondsToHms(summary.elapsedSeconds);
      this.form.patchValue({ RideTimeHours: hours, RideTimeMinutes: minutes, RideTimeSeconds: seconds });
    }

    this.gpxDistanceMiles = summary.distanceMiles;
    this.applyEndOdometer();
  }

  /** Keeps EndOdometer in sync with StartOdometer + GPX distance, however
   *  the bike selection and GPX upload happened to be ordered. */
  private applyEndOdometer(): void {
    if (this.gpxDistanceMiles === null) {
      return;
    }
    const start = this.form.get('StartOdometer')!.value ?? 0;
    this.form.patchValue({ EndOdometer: roundTo(start + this.gpxDistanceMiles, 2) });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fill in all required fields (highlighted below) before saving.';
      return;
    }

    this.submitting = true;
    this.error = null;
    const v = this.form.getRawValue();

    this.ridesService
      .postTrainingRide({
        TrainingRide: {
          ExerciseDate: v.ExerciseDate,
          StartTime: v.StartTime,
          EndTime: v.EndTime,
          EquipmentId: v.EquipmentId,
          RouteId: v.RouteId,
          StartOdometer: v.StartOdometer,
          EndOdometer: v.EndOdometer,
          RideTimeHours: v.RideTimeHours,
          RideTimeMinutes: v.RideTimeMinutes,
          RideTimeSeconds: v.RideTimeSeconds,
          Quantity: v.Quantity,
          MaxSpeed: v.MaxSpeed,
          AverageHr: v.AverageHr,
          MaxHr: v.MaxHr,
          AverageCadence: v.AverageCadence,
          ElevationGain: v.ElevationGain,
          WindSpeed: v.WindSpeed,
          WindDirection: v.WindDirection || null,
          Temperature: v.Temperature,
          Precipitation: v.Precipitation,
          NumberOfAttempts: v.NumberOfAttempts,
          NumberOfSuccesses: v.NumberOfSuccesses,
          Notes: v.Notes || null
        },
        Gpx: this.gpx
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/rides/training'),
        error: () => {
          this.error = 'Could not save this ride. Confirm the API is running and reachable.';
          this.submitting = false;
        }
      });
  }
}