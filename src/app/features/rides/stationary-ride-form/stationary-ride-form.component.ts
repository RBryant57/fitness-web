import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RidesService } from '../../../core/services/rides.service';
import { BikesService } from '../../../core/services/bikes.service';
import { Bike } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-stationary-ride-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './stationary-ride-form.component.html'
})
export class StationaryRideFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ridesService = inject(RidesService);
  private bikesService = inject(BikesService);
  private router = inject(Router);

  bikes: Bike[] = [];
  submitting = false;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    ExerciseDate: ['', Validators.required],
    StartTime: ['', Validators.required],
    EndTime: ['', Validators.required],
    EquipmentId: [null as number | null, Validators.required],
    StartOdometer: [0, Validators.required],
    EndOdometer: [0, Validators.required],
    RideTimeHours: [0],
    RideTimeMinutes: [0],
    RideTimeSeconds: [0],
    Quantity: [null as number | null],
    AverageHr: [0],
    MaxHr: [0],
    AverageCadence: [0],
    Notes: ['']
  });

  ngOnInit(): void {
    this.bikesService.getAll().subscribe(bikes => (this.bikes = bikes));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;
    const v = this.form.getRawValue();

    this.ridesService
      .postStationaryRide({
        ExerciseDate: v.ExerciseDate,
        StartTime: v.StartTime,
        EndTime: v.EndTime,
        EquipmentId: v.EquipmentId,
        StartOdometer: v.StartOdometer,
        EndOdometer: v.EndOdometer,
        RideTimeHours: v.RideTimeHours,
        RideTimeMinutes: v.RideTimeMinutes,
        RideTimeSeconds: v.RideTimeSeconds,
        Quantity: v.Quantity,
        AverageHr: v.AverageHr,
        MaxHr: v.MaxHr,
        AverageCadence: v.AverageCadence,
        Notes: v.Notes || null,
        // Inherited [NotMapped] fields from ExerciseBase — not meaningful
        // for a stationary ride, sent as neutral defaults.
        ElevationGain: 0,
        MaxSpeed: 0,
        Precipitation: false,
        RouteId: 0,
        Temperature: 0
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/rides/stationary'),
        error: () => {
          this.error = 'Could not save this ride. Confirm the API is running and reachable.';
          this.submitting = false;
        }
      });
  }
}
