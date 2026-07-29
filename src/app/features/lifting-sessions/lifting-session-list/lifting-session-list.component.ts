import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LiftingSessionsService } from '../../../core/services/lifting-sessions.service';
import { CircuitsService } from '../../../core/services/circuits.service';
import { LiftingSession, Circuit } from '../../../core/models/strength.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-lifting-session-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './lifting-session-list.component.html'
})
export class LiftingSessionListComponent implements OnInit {
  private liftingSessionsService = inject(LiftingSessionsService);
  private circuitsService = inject(CircuitsService);

  sessions: LiftingSession[] = [];
  circuitsById = new Map<number, Circuit>();
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.circuitsService.getAll().subscribe(circuits => {
      this.circuitsById = new Map(circuits.filter(c => c.Id != null).map(c => [c.Id as number, c]));
    });

    this.liftingSessionsService.getAll().subscribe({
      next: sessions => {
        this.sessions = sessions.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load lifting sessions. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
