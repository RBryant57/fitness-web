import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CircuitsService } from '../../../core/services/circuits.service';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-circuit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './circuit-form.component.html'
})
export class CircuitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private circuitsService = inject(CircuitsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = false;
  loading = false;
  error: string | null = null;
  circuitId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.circuitId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.circuitId = Number(idParam);
      this.loading = true;
      this.circuitsService.getById(this.circuitId).subscribe({
        next: circuit => {
          this.form.patchValue({ Name: circuit.Name, Notes: circuit.Notes ?? '' });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this circuit.';
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
    const payload = { Id: this.circuitId, Name: v.Name, Notes: v.Notes || null };

    const save$: Observable<unknown> = this.isEdit
      ? this.circuitsService.update(this.circuitId!, payload)
      : this.circuitsService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/circuits'),
      error: () => {
        this.error = 'Could not save this circuit. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
