import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RidesService } from '../../../core/services/rides.service';
import { BikesService } from '../../../core/services/bikes.service';
import { RouteService } from '../../../core/services/route.service';
import { Bike } from '../../../core/models/equipment.model';
import { Route } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { GpxUploadComponent } from '../../../shared/components/gpx-upload/gpx-upload.component';

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

  form = this.fb.nonNullable.group({
    ExerciseDate: ['', Validators.required],
    StartTime: ['', Validators.required],
    EndTime: ['', Validators.required],
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
