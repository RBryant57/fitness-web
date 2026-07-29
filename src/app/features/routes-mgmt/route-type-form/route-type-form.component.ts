import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { RouteService } from '../../../core/services/route.service';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-route-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './route-type-form.component.html'
})
export class RouteTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  submitting = false;
  loading = false;
  error: string | null = null;
  routeTypeId: number | null = null;

  form = this.fb.nonNullable.group({
    Name: ['', Validators.required],
    EnumId: [0, Validators.required]
  });

  get isEdit(): boolean {
    return this.routeTypeId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.routeTypeId = Number(idParam);
      this.loading = true;
      // No single-item fetch endpoint (route ambiguity — see RouteService);
      // find it in the full list instead.
      this.routeService.getRouteTypes().subscribe({
        next: types => {
          const match = types.find(t => t.Id === this.routeTypeId);
          if (match) {
            this.form.patchValue({ Name: match.Name, EnumId: match.EnumId });
          } else {
            this.error = 'Could not find this route type.';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load this route type.';
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
    const payload = { Id: this.routeTypeId, EnumId: v.EnumId, Name: v.Name };

    const save$: Observable<unknown> = this.isEdit
      ? this.routeService.updateRouteType(this.routeTypeId!, payload)
      : this.routeService.createRouteType(payload);

    save$.subscribe({
      next: () => this.router.navigateByUrl('/routes/types'),
      error: () => {
        this.error = 'Could not save this route type. Confirm the API is running and reachable.';
        this.submitting = false;
      }
    });
  }
}
