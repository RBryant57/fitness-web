import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { PartsService } from '../../../core/services/parts.service';
import { ManufacturersService } from '../../../core/services/manufacturers.service';
import { Manufacturer, PartType } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-part-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './part-form.component.html'
})
export class PartFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private partsService = inject(PartsService);
  private manufacturersService = inject(ManufacturersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  manufacturers: Manufacturer[] = [];
  partTypes: PartType[] = [];
  submitting = false;
  loading = false;
  error: string | null = null;
  partId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    ManufacturerId: [null as number | null, Validators.required],
    PartTypeId: [null as number | null, Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.partId !== null;
  }

  ngOnInit(): void {
    this.manufacturersService.getAll().subscribe(m => (this.manufacturers = m));
    this.partsService.getPartTypes().subscribe(t => (this.partTypes = t));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.partId = Number(idParam);
      this.loading = true;
      this.partsService.getById(this.partId).subscribe({
        next: part => {
          this.form.patchValue({
            Name: part.Name,
            ManufacturerId: part.ManufacturerId,
            PartTypeId: part.PartTypeId,
            Notes: part.Notes ?? ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this part.';
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
      Id: this.partId,
      Name: v.Name,
      ManufacturerId: v.ManufacturerId as number,
      PartTypeId: v.PartTypeId as number,
      Notes: v.Notes || null
    };

    const save$: Observable<unknown> = this.isEdit
      ? this.partsService.update(this.partId!, payload)
      : this.partsService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/parts'),
      error: () => {
        this.error = 'Could not save this part. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
