import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ManufacturersService } from '../../../core/services/manufacturers.service';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-manufacturer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './manufacturer-form.component.html'
})
export class ManufacturerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private manufacturersService = inject(ManufacturersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = false;
  loading = false;
  error: string | null = null;
  manufacturerId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.manufacturerId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.manufacturerId = Number(idParam);
      this.loading = true;
      this.manufacturersService.getById(this.manufacturerId).subscribe({
        next: m => {
          this.form.patchValue({ Name: m.Name, Notes: m.Notes ?? '' });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this manufacturer.';
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
    const payload = { Id: this.manufacturerId, Name: v.Name, Notes: v.Notes || null };

    const save$: Observable<unknown> = this.isEdit
      ? this.manufacturersService.update(this.manufacturerId!, payload)
      : this.manufacturersService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/manufacturers'),
      error: () => {
        this.error = 'Could not save this manufacturer. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
