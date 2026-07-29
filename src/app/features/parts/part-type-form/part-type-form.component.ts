import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { PartsService } from '../../../core/services/parts.service';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-part-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './part-type-form.component.html'
})
export class PartTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private partsService = inject(PartsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = false;
  loading = false;
  error: string | null = null;
  partTypeId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.partTypeId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.partTypeId = Number(idParam);
      this.loading = true;
      // No single-item fetch endpoint (route ambiguity — see PartsService);
      // find it in the full list instead.
      this.partsService.getPartTypes().subscribe({
        next: types => {
          const match = types.find(t => t.Id === this.partTypeId);
          if (match) {
            this.form.patchValue({ Name: match.Name, Notes: match.Notes ?? '' });
          } else {
            this.error = 'Could not find this part type.';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this part type.';
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
    const payload = { Id: this.partTypeId, Name: v.Name, Notes: v.Notes || null };

    const save$: Observable<unknown> = this.isEdit
      ? this.partsService.updatePartType(this.partTypeId!, payload)
      : this.partsService.createPartType(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/parts/types'),
      error: () => {
        this.error = 'Could not save this part type. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
