import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BikesService } from '../../../core/services/bikes.service';
import { Bike } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-bike-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './bike-list.component.html'
})
export class BikeListComponent implements OnInit {
  private bikesService = inject(BikesService);

  bikes: Bike[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.bikesService.getAll().subscribe({
      next: bikes => {
        this.bikes = bikes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load bikes. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
