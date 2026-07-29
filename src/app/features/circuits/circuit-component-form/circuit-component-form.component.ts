import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CircuitsService } from '../../../core/services/circuits.service';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-circuit-component-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './circuit-component-form.component.html'
})
export class CircuitComponentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private circuitsService = inject(CircuitsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = false;
  loading = false;
  error: string | null = null;
  componentId: number | null = null;

  form = this.fb.nonNullable.group({
    ExerciseName: ['', Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.componentId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.componentId = Number(idParam);
      this.loading = true;
      this.circuitsService.getComponent(this.componentId).subscribe({
        next: c => {
          this.form.patchValue({ ExerciseName: c.ExerciseName, Notes: c.Notes ?? '' });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this component.';
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
    const payload = { Id: this.componentId, ExerciseName: v.ExerciseName, Notes: v.Notes || null };

    const save$: Observable<unknown> = this.isEdit
      ? this.circuitsService.updateComponent(this.componentId!, payload)
      : this.circuitsService.createComponent(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/circuits/components'),
      error: () => {
        this.error = 'Could not save this component. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
