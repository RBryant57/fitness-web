import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RidesService } from '../../../core/services/rides.service';
import { QuantityRequest } from '../../../core/models/common.model';
import { StationaryRideView } from '../../../core/models/ride.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { formatDecimal, formatHms } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-stationary-ride-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './stationary-ride-list.component.html'
})
export class StationaryRideListComponent implements OnInit {
  private ridesService = inject(RidesService);

  rides: StationaryRideView[] = [];
  loading = true;
  error: string | null = null;
  formatHms = formatHms;
  formatDecimal = formatDecimal;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    const request: QuantityRequest = {};
    this.ridesService.getStationaryRideViews(request).subscribe({
      next: rides => {
        this.rides = rides.sort((a, b) => new Date(b.RideDate).getTime() - new Date(a.RideDate).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load stationary rides. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
