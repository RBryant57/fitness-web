import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RunsService } from '../../../core/services/runs.service';
import { ShoesService } from '../../../core/services/shoes.service';
import { Shoe } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { nowDatetimeLocal } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-treadmill-run-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './treadmill-run-form.component.html'
})
export class TreadmillRunFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private runsService = inject(RunsService);
  private shoesService = inject(ShoesService);
  private router = inject(Router);

  shoes: Shoe[] = [];
  submitting = false;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    ExerciseDate: ['', Validators.required],
    // Defaulted to "now" (with seconds) so the field is never left blank —
    // native datetime-local inputs report an empty value until every
    // segment, including AM/PM, has been filled in by the user.
    StartTime: [nowDatetimeLocal(), Validators.required],
    EndTime: [nowDatetimeLocal(), Validators.required],
    EquipmentId: [null as number | null, Validators.required],
    RunTimeHours: [0],
    RunTimeMinutes: [0],
    RunTimeSeconds: [0],
    Quantity: [null as number | null],
    MaxSpeed: [0],
    AverageHr: [0],
    MaxHr: [0],
    Notes: ['']
  });

  ngOnInit(): void {
    this.shoesService.getAll().subscribe(shoes => (this.shoes = shoes));
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
      .postTreadmillRun({
        ExerciseDate: v.ExerciseDate,
        StartTime: v.StartTime,
        EndTime: v.EndTime,
        EquipmentId: v.EquipmentId,
        RunTimeHours: v.RunTimeHours,
        RunTimeMinutes: v.RunTimeMinutes,
        RunTimeSeconds: v.RunTimeSeconds,
        Quantity: v.Quantity,
        MaxSpeed: v.MaxSpeed,
        AverageHr: v.AverageHr,
        MaxHr: v.MaxHr,
        Notes: v.Notes || null,
        // Inherited [NotMapped] fields from ExerciseBase — not meaningful
        // for an indoor treadmill run, sent as neutral defaults.
        ElevationGain: 0,
        Precipitation: false,
        RouteId: 0,
        Temperature: 0,
        AverageCadence: 0
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/runs/treadmill'),
        error: () => {
          this.error = 'Could not save this run. Confirm the API is running and reachable.';
          this.submitting = false;
        }
      });
  }
}