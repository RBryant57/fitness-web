import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ShoesService } from '../../../core/services/shoes.service';
import { ManufacturersService } from '../../../core/services/manufacturers.service';
import { Manufacturer, ShoeType } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-shoe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './shoe-form.component.html'
})
export class ShoeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private shoesService = inject(ShoesService);
  private manufacturersService = inject(ManufacturersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  manufacturers: Manufacturer[] = [];
  shoeTypes: ShoeType[] = [];
  submitting = false;
  loading = false;
  error: string | null = null;
  shoeId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    ManufacturerId: [null as number | null, Validators.required],
    ShoeTypeId: [null as number | null, Validators.required],
    AcquisitionDate: ['', Validators.required],
    RetireDate: [''],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.shoeId !== null;
  }

  ngOnInit(): void {
    this.manufacturersService.getAll().subscribe(m => (this.manufacturers = m));
    this.shoesService.getShoeTypes().subscribe(t => (this.shoeTypes = t));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.shoeId = Number(idParam);
      this.loading = true;
      this.shoesService.getById(this.shoeId).subscribe({
        next: shoe => {
          this.form.patchValue({
            Name: shoe.Name,
            ManufacturerId: shoe.ManufacturerId,
            ShoeTypeId: shoe.ShoeTypeId,
            AcquisitionDate: toDateInput(shoe.AcquisitionDate),
            RetireDate: toDateInput(shoe.RetireDate),
            Notes: shoe.Notes ?? ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this shoe.';
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
      Id: this.shoeId,
      Name: v.Name,
      ManufacturerId: v.ManufacturerId as number,
      ShoeTypeId: v.ShoeTypeId as number,
      AcquisitionDate: v.AcquisitionDate,
      RetireDate: v.RetireDate || null,
      Notes: v.Notes || null
    };

    const save$: Observable<unknown> = this.isEdit
      ? this.shoesService.update(this.shoeId!, payload)
      : this.shoesService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/shoes'),
      error: () => {
        this.error = 'Could not save this shoe. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
