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
import { nowDatetimeLocal } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-recreational-ride-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent, GpxUploadComponent],
  templateUrl: './recreational-ride-form.component.html'
})
export class RecreationalRideFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ridesService = inject(RidesService);
  private bikesService = inject(BikesService);
  private routeService = inject(RouteService);
  private router = inject(Router);

  bikes: Bike[] = [];
  routes: Route[] = [];
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
    BikeEndTime: [''],
    EquipmentId: [null as number | null, Validators.required],
    RouteId: [null as number | null, Validators.required],
    StartOdometer: [0, Validators.required],
    EndOdometer: [0, Validators.required],
    RideTimeHours: [0],
    RideTimeMinutes: [0],
    RideTimeSeconds: [0],
    BikeTimeHours: [0],
    BikeTimeMinutes: [0],
    BikeTimeSeconds: [0],
    Quantity: [null as number | null],
    MaxSpeed: [0],
    AverageHr: [0],
    MaxHr: [0],
    AverageCadence: [0],
    ElevationGain: [0],
    Wind: [''],
    Temperature: [0],
    Precipitation: [false],
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
        }
      });
  }

  onGpxLoaded(gpx: string | null): void {
    this.gpx = gpx;
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
      .postRecreationalRide({
        RecreationalRide: {
          ExerciseDate: v.ExerciseDate,
          StartTime: v.StartTime,
          EndTime: v.EndTime,
          BikeEndTime: v.BikeEndTime || v.EndTime,
          EquipmentId: v.EquipmentId,
          RouteId: v.RouteId,
          StartOdometer: v.StartOdometer,
          EndOdometer: v.EndOdometer,
          RideTimeHours: v.RideTimeHours,
          RideTimeMinutes: v.RideTimeMinutes,
          RideTimeSeconds: v.RideTimeSeconds,
          BikeTimeHours: v.BikeTimeHours,
          BikeTimeMinutes: v.BikeTimeMinutes,
          BikeTimeSeconds: v.BikeTimeSeconds,
          Quantity: v.Quantity,
          MaxSpeed: v.MaxSpeed,
          AverageHr: v.AverageHr,
          MaxHr: v.MaxHr,
          AverageCadence: v.AverageCadence,
          ElevationGain: v.ElevationGain,
          Wind: v.Wind || null,
          Temperature: v.Temperature,
          Precipitation: v.Precipitation,
          Notes: v.Notes || null
        },
        Gpx: this.gpx
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/rides/recreational'),
        error: () => {
          this.error = 'Could not save this ride. Confirm the API is running and reachable.';
          this.submitting = false;
        }
      });
  }
}