import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RouteService } from '../../../core/services/route.service';
import { Route, RouteType } from '../../../core/models/route.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './route-list.component.html'
})
export class RouteListComponent implements OnInit {
  private routeService = inject(RouteService);

  routes: Route[] = [];
  typesById = new Map<number, RouteType>();
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.routeService.getRouteTypes().subscribe(types => {
      this.typesById = new Map(types.filter(t => t.Id != null).map(t => [t.Id as number, t]));
    });

    this.routeService.getAll().subscribe({
      next: routes => {
        this.routes = routes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load routes. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
