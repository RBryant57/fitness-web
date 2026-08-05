import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RunsService } from '../../../core/services/runs.service';
import { ShoesService } from '../../../core/services/shoes.service';
import { RouteService } from '../../../core/services/route.service';
import { Shoe } from '../../../core/models/equipment.model';
import { Route } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { GpxUploadComponent } from '../../../shared/components/gpx-upload/gpx-upload.component';
import { nowDatetimeLocal, roundTo, toDateInput, toDatetimeLocal } from '../../../shared/utils/format.util';
import { GpxSummary, secondsToHms } from '../../../shared/utils/gpx-parser.util';

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

@Component({
  selector: 'app-training-run-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent, GpxUploadComponent],
  templateUrl: './training-run-form.component.html'
})
export class TrainingRunFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private runsService = inject(RunsService);
  private shoesService = inject(ShoesService);
  private routeService = inject(RouteService);
  private router = inject(Router);

  shoes: Shoe[] = [];
  routes: Route[] = [];
  windDirections = WIND_DIRECTIONS;
  submitting = false;
  error: string | null = null;
  gpx: string | null = null;

  form = this.fb.nonNullable.group({
    ExerciseDate: ['', Validators.required],
    // Defaulted to "now" (with seconds) so the field is never left blank —
    // native datetime-local inputs report an empty value until every
    // segment, including AM/PM, has been filled in by the user.
    StartTime: [nowDatetimeLocal(), Validators.required],
    EndTime: [nowDatetimeLocal(), Validators.required],
    EquipmentId: [null as number | null, Validators.required],
    RouteId: [null as number | null, Validators.required],
    RunTimeHours: [0],
    RunTimeMinutes: [0],
    RunTimeSeconds: [0],
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
    this.shoesService.getAll().subscribe(shoes => (this.shoes = shoes));
    this.routeService.getAll().subscribe(routes => (this.routes = routes));
  }

  onGpxLoaded(gpx: string | null): void {
    this.gpx = gpx;
  }

  /** Pre-fills form fields from a parsed GPX file. Only touches fields the
   *  track actually has data for — shoe, route, weather, crossing counts,
   *  and notes still need to be entered by hand. */
  onGpxSummary(summary: GpxSummary | null): void {
    if (!summary) {
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
    // This form has a single required run-time field (no separate
    // moving/elapsed split), so use the full elapsed duration of the track.
    if (summary.elapsedSeconds !== null) {
      const { hours, minutes, seconds } = secondsToHms(summary.elapsedSeconds);
      this.form.patchValue({ RunTimeHours: hours, RunTimeMinutes: minutes, RunTimeSeconds: seconds });
    }
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

    this.runsService
      .postTrainingRun({
        TrainingRun: {
          ExerciseDate: v.ExerciseDate,
          StartTime: v.StartTime,
          EndTime: v.EndTime,
          EquipmentId: v.EquipmentId,
          RouteId: v.RouteId,
          RunTimeHours: v.RunTimeHours,
          RunTimeMinutes: v.RunTimeMinutes,
          RunTimeSeconds: v.RunTimeSeconds,
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
        next: () => this.router.navigateByUrl('/runs/training'),
        error: () => {
          this.error = 'Could not save this run. Confirm the API is running and reachable.';
          this.submitting = false;
        }
      });
  }
}