import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { RouteService } from '../../../core/services/route.service';
import { RouteType } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './route-form.component.html'
})
export class RouteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  routeTypes: RouteType[] = [];
  submitting = false;
  loading = false;
  error: string | null = null;
  routeId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    City: [''],
    State: [''],
    TypeId: [null as number | null, Validators.required],
    Rating: [3, Validators.required],
    Notes: ['']
  });

  get isEdit(): boolean {
    return this.routeId !== null;
  }

  ngOnInit(): void {
    this.routeService.getRouteTypes().subscribe(t => (this.routeTypes = t));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.routeId = Number(idParam);
      this.loading = true;
      this.routeService.getById(this.routeId).subscribe({
        next: route => {
          this.form.patchValue({
            Name: route.Name,
            City: route.City ?? '',
            State: route.State ?? '',
            TypeId: route.TypeId,
            Rating: route.Rating,
            Notes: route.Notes ?? ''
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this route.';
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
      Id: this.routeId,
      Name: v.Name,
      City: v.City || null,
      State: v.State || null,
      TypeId: v.TypeId as number,
      Rating: v.Rating,
      Notes: v.Notes || null
    };

    const save$: Observable<unknown> = this.isEdit
      ? this.routeService.update(this.routeId!, payload)
      : this.routeService.create(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/routes'),
      error: () => {
        this.error = 'Could not save this route. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
