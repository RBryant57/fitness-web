import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { BikesService } from '../../../core/services/bikes.service';
import { ManufacturersService } from '../../../core/services/manufacturers.service';
import { Manufacturer } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-bike-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './bike-form.component.html'
})
export class BikeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bikesService = inject(BikesService);
  private manufacturersService = inject(ManufacturersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  manufacturers: Manufacturer[] = [];
  submitting = false;
  loading = false;
  error: string | null = null;
  bikeId: number | null = null;
  maxOdometer: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    ManufacturerId: [null as number | null, Validators.required],
    TypeId: [0, Validators.required],
    AcquisitionDate: ['', Validators.required],
    BaseMiles: [0],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.bikeId !== null;
  }

  ngOnInit(): void {
    this.manufacturersService.getAll().subscribe(m => (this.manufacturers = m));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bikeId = Number(idParam);
      this.loading = true;
      this.bikesService.getById(this.bikeId).subscribe({
        next: bike => {
          this.form.patchValue({
            Name: bike.Name,
            ManufacturerId: bike.ManufacturerId,
            TypeId: bike.TypeId,
            AcquisitionDate: toDateInput(bike.AcquisitionDate),
            BaseMiles: bike.BaseMiles,
            Notes: bike.Notes ?? ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this bike.';
          this.loading = false;
        }
      });
      this.bikesService.getMaxOdometer(this.bikeId).subscribe({
        next: max => (this.maxOdometer = max),
        error: () => (this.maxOdometer = null)
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
      Id: this.bikeId,
      Name: v.Name,
      ManufacturerId: v.ManufacturerId as number,
      TypeId: v.TypeId,
      AcquisitionDate: v.AcquisitionDate,
      BaseMiles: v.BaseMiles,
      Notes: v.Notes || null
    };

    const save$: Observable<unknown> = this.isEdit
      ? this.bikesService.update(this.bikeId!, payload)
      : this.bikesService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/bikes'),
      error: () => {
        this.error = 'Could not save this bike. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
