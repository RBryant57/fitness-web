import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { WeightsService } from '../../../core/services/weights.service';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-weight-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './weight-form.component.html'
})
export class WeightFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private weightsService = inject(WeightsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = false;
  loading = false;
  error: string | null = null;
  weightId: number | null = null;

  form = this.fb.nonNullable.group({
    Date: ['', Validators.required],
    Quantity: [null as number | null, Validators.required],
    BodyFatPercentage: [null as number | null],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.weightId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.weightId = Number(idParam);
      this.loading = true;
      this.weightsService.getById(this.weightId).subscribe({
        next: w => {
          this.form.patchValue({
            Date: toDateInput(w.Date),
            Quantity: w.Quantity,
            BodyFatPercentage: w.BodyFatPercentage,
            Notes: w.Notes ?? ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this reading.';
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;
    const v = this.form.getRawValue();
    const payload = {
      Id: this.weightId,
      Date: v.Date,
      Quantity: v.Quantity as number,
      BodyFatPercentage: v.BodyFatPercentage ?? 0,
      Notes: v.Notes || null
    };

    const save$: Observable<unknown> = this.isEdit
      ? this.weightsService.update(this.weightId!, payload)
      : this.weightsService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/weights'),
      error: () => {
        this.error = 'Could not save this reading. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
