import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RouteService } from '../../../core/services/route.service';
import { RouteType } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-route-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './route-type-list.component.html'
})
export class RouteTypeListComponent implements OnInit {
  private routeService = inject(RouteService);

  routeTypes: RouteType[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.routeService.getRouteTypes().subscribe({
      next: types => {
        this.routeTypes = types;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load route types. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
