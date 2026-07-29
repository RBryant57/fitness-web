import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { LiftingSessionsService } from '../../../core/services/lifting-sessions.service';
import { CircuitsService } from '../../../core/services/circuits.service';
import { Circuit } from '../../../core/models/strength.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-lifting-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './lifting-session-form.component.html'
})
export class LiftingSessionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private liftingSessionsService = inject(LiftingSessionsService);
  private circuitsService = inject(CircuitsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  circuits: Circuit[] = [];
  submitting = false;
  loading = false;
  error: string | null = null;
  sessionId: number | null = null;

  form = this.fb.nonNullable.group({
    Date: ['', Validators.required],
    CircuitId: [null as number | null, Validators.required],
    NumberOfSets: [1, Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.sessionId !== null;
  }

  ngOnInit(): void {
    this.circuitsService.getAll().subscribe(c => (this.circuits = c));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.sessionId = Number(idParam);
      this.loading = true;
      this.liftingSessionsService.getById(this.sessionId).subscribe({
        next: session => {
          this.form.patchValue({
            Date: toDateInput(session.Date),
            CircuitId: session.CircuitId,
            NumberOfSets: session.NumberOfSets,
            Notes: session.Notes ?? ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this session.';
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
      Id: this.sessionId,
      Date: v.Date,
      CircuitId: v.CircuitId as number,
      NumberOfSets: v.NumberOfSets,
      Notes: v.Notes || null
    };

    const save$: Observable<unknown> = this.isEdit
      ? this.liftingSessionsService.update(this.sessionId!, payload)
      : this.liftingSessionsService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/lifting-sessions'),
      error: () => {
        this.error = 'Could not save this session. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
