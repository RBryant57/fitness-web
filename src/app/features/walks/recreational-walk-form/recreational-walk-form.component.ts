import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { WalksService } from '../../../core/services/walks.service';
import { ShoesService } from '../../../core/services/shoes.service';
import { RouteService } from '../../../core/services/route.service';
import { Shoe } from '../../../core/models/equipment.model';
import { Route } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { GpxUploadComponent } from '../../../shared/components/gpx-upload/gpx-upload.component';
import { nowDatetimeLocal, roundTo, toDateInput, toDatetimeLocal } from '../../../shared/utils/format.util';
import { GpxSummary, secondsToHms } from '../../../shared/utils/gpx-parser.util';

@Component({
  selector: 'app-recreational-walk-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent, GpxUploadComponent],
  templateUrl: './recreational-walk-form.component.html'
})
export class RecreationalWalkFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private walksService = inject(WalksService);
  private shoesService = inject(ShoesService);
  private routeService = inject(RouteService);
  private router = inject(Router);

  shoes: Shoe[] = [];
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
    PathEndTime: [''],
    EquipmentId: [null as number | null, Validators.required],
    RouteId: [null as number | null, Validators.required],
    WalkTimeHours: [0],
    WalkTimeMinutes: [0],
    WalkTimeSeconds: [0],
    PathTimeHours: [0],
    PathTimeMinutes: [0],
    PathTimeSeconds: [0],
    Quantity: [null as number | null],
    MaxSpeed: [0],
    AverageHr: [0],
    MaxHr: [0],
    ElevationGain: [0],
    Wind: [''],
    Temperature: [0],
    Precipitation: [false],
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
   *  track actually has data for — shoe, route, weather, and notes still
   *  need to be entered by hand. */
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
    if (summary.elevationGainFeet !== null) {
      this.form.patchValue({ ElevationGain: roundTo(summary.elevationGainFeet) });
    }
    if (summary.temperatureF !== null) {
      this.form.patchValue({ Temperature: roundTo(summary.temperatureF) });
    }
    if (summary.movingSeconds !== null) {
      const { hours, minutes, seconds } = secondsToHms(summary.movingSeconds);
      this.form.patchValue({ WalkTimeHours: hours, WalkTimeMinutes: minutes, WalkTimeSeconds: seconds });
    }
    if (summary.elapsedSeconds !== null) {
      const { hours, minutes, seconds } = secondsToHms(summary.elapsedSeconds);
      this.form.patchValue({ PathTimeHours: hours, PathTimeMinutes: minutes, PathTimeSeconds: seconds });
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

    this.walksService
      .postRecreationalWalk({
        RecreationalWalk: {
          ExerciseDate: v.ExerciseDate,
          StartTime: v.StartTime,
          EndTime: v.EndTime,
          PathEndTime: v.PathEndTime || v.EndTime,
          EquipmentId: v.EquipmentId,
          RouteId: v.RouteId,
          WalkTimeHours: v.WalkTimeHours,
          WalkTimeMinutes: v.WalkTimeMinutes,
          WalkTimeSeconds: v.WalkTimeSeconds,
          PathTimeHours: v.PathTimeHours,
          PathTimeMinutes: v.PathTimeMinutes,
          PathTimeSeconds: v.PathTimeSeconds,
          Quantity: v.Quantity,
          MaxSpeed: v.MaxSpeed,
          AverageHr: v.AverageHr,
          MaxHr: v.MaxHr,
          ElevationGain: v.ElevationGain,
          Wind: v.Wind || null,
          Temperature: v.Temperature,
          Precipitation: v.Precipitation,
          Notes: v.Notes || null
        },
        Gpx: this.gpx
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/walks/recreational'),
        error: () => {
          this.error = 'Could not save this walk. Confirm the API is running and reachable.';
          this.submitting = false;
        }
      });
  }
}