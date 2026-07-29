import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MilesService } from '../../../core/services/miles.service';
import { BikesService } from '../../../core/services/bikes.service';
import { MileageDistribution, OutdoorIndoor, WORKOUT_TYPE_OPTIONS } from '../../../core/models/analytics.model';
import { Bike } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../../shared/utils/format.util';

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

@Component({
  selector: 'app-miles-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouteDividerComponent],
  templateUrl: './miles-analytics.component.html'
})
export class MilesAnalyticsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private milesService = inject(MilesService);
  private bikesService = inject(BikesService);

  workoutTypes = WORKOUT_TYPE_OPTIONS;
  bikes: Bike[] = [];

  loading = true;
  error: string | null = null;
  totalMiles: number | null = null;
  missedMiles: number | null = null;
  distribution: MileageDistribution[] = [];
  outdoorIndoor: OutdoorIndoor[] = [];

  filterForm = this.fb.nonNullable.group({
    startDate: [toDateInput(daysAgo(180))],
    endDate: [toDateInput(new Date().toISOString())],
    typeId: [3] // TrainingRide
  });

  yearForm = this.fb.nonNullable.group({
    year: [new Date().getFullYear()]
  });

  missedMilesForm = this.fb.nonNullable.group({
    date: [toDateInput(new Date().toISOString())],
    miles: [0],
    exerciseTypeId: [1],
    notes: ['']
  });

  bikeOnlyForm = this.fb.nonNullable.group({
    date: [toDateInput(new Date().toISOString())],
    bikeId: [null as number | null],
    startOdometer: [0],
    endOdometer: [0],
    notes: ['']
  });

  missedSaving = false;
  bikeOnlySaving = false;
  missedSaved = false;
  bikeOnlySaved = false;

  ngOnInit(): void {
    this.bikesService.getAll().subscribe(bikes => (this.bikes = bikes));
    this.load();
    this.loadOutdoorIndoor();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    const v = this.filterForm.getRawValue();
    const request = { StartDate: v.startDate, EndDate: v.endDate, TypeId: v.typeId };

    this.milesService.getMilesByDateByType(request).subscribe({
      next: miles => (this.totalMiles = miles),
      error: () => (this.totalMiles = null)
    });
    this.milesService.getMissedMilesByDateByType(request).subscribe({
      next: miles => (this.missedMiles = miles),
      error: () => (this.missedMiles = null)
    });
    this.milesService.getMileageDistribution(request).subscribe({
      next: dist => {
        this.distribution = dist.sort((a, b) => a.PeriodNumber - b.PeriodNumber);
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load mileage data. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }

  loadOutdoorIndoor(): void {
    const year = this.yearForm.getRawValue().year;
    this.milesService.getOutdoorIndoorRides(year).subscribe({
      next: rows => (this.outdoorIndoor = rows),
      error: () => (this.outdoorIndoor = [])
    });
  }

  submitMissedMiles(): void {
    this.missedSaving = true;
    this.missedSaved = false;
    const v = this.missedMilesForm.getRawValue();
    this.milesService
      .postMissedMiles({
        Date: v.date,
        Miles: v.miles,
        ExerciseTypeId: v.exerciseTypeId,
        Notes: v.notes || null
      })
      .subscribe({
        next: () => {
          this.missedSaving = false;
          this.missedSaved = true;
        },
        error: () => {
          this.missedSaving = false;
          this.error = 'Could not log missed miles.';
        }
      });
  }

  submitBikeOnlyMiles(): void {
    if (!this.bikeOnlyForm.getRawValue().bikeId) {
      return;
    }
    this.bikeOnlySaving = true;
    this.bikeOnlySaved = false;
    const v = this.bikeOnlyForm.getRawValue();
    this.milesService
      .postBikeOnlyMiles({
        Date: v.date,
        BikeId: v.bikeId as number,
        StartOdometer: v.startOdometer,
        EndOdometer: v.endOdometer,
        Notes: v.notes || null
      })
      .subscribe({
        next: () => {
          this.bikeOnlySaving = false;
          this.bikeOnlySaved = true;
        },
        error: () => {
          this.bikeOnlySaving = false;
          this.error = 'Could not log bike-only miles.';
        }
      });
  }
}
