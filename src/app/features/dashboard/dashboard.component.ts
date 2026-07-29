import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';

import { RouteDividerComponent } from '../../shared/components/route-divider/route-divider.component';
import { RidesService } from '../../core/services/rides.service';
import { RunsService } from '../../core/services/runs.service';
import { WalksService } from '../../core/services/walks.service';
import { QuantityRequest } from '../../core/models/common.model';

interface DashboardTile {
  label: string;
  path: string;
  hint: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private ridesService = inject(RidesService);
  private runsService = inject(RunsService);
  private walksService = inject(WalksService);

  loading = true;
  recentRideCount = 0;
  recentRunCount = 0;
  recentWalkCount = 0;

  quickLinks: DashboardTile[] = [
    { label: 'Log a Training Ride', path: '/rides/training/new', hint: 'Bike + route + GPX' },
    { label: 'Log a Training Run', path: '/runs/training/new', hint: 'Shoe + route + GPX' },
    { label: 'Log a Training Walk', path: '/walks/training/new', hint: 'Shoe + route + GPX' },
    { label: 'Record body weight', path: '/weights/new', hint: 'Weight + body fat %' }
  ];

  sections: DashboardTile[] = [
    { label: 'Training Log', path: '/rides/training', hint: 'Rides, runs & walks' },
    { label: 'Strength', path: '/lifting-sessions', hint: 'Lifting sessions & circuits' },
    { label: 'Equipment', path: '/bikes', hint: 'Bikes, shoes & parts' },
    { label: 'Routes', path: '/routes', hint: 'Course library' },
    { label: 'Analytics', path: '/analytics/miles', hint: 'Mileage & weather trends' }
  ];

  ngOnInit(): void {
    const last30: QuantityRequest = {
      StartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      EndDate: new Date().toISOString()
    };

    forkJoin({
      rides: this.ridesService.getTrainingRideViews(last30).pipe(catchError(() => of([]))),
      runs: this.runsService.getTrainingRunViews(last30).pipe(catchError(() => of([]))),
      walks: this.walksService.getTrainingWalkViews(last30).pipe(catchError(() => of([])))
    }).subscribe(({ rides, runs, walks }) => {
      this.recentRideCount = rides.length;
      this.recentRunCount = runs.length;
      this.recentWalkCount = walks.length;
      this.loading = false;
    });
  }
}
