import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WalksService } from '../../../core/services/walks.service';
import { TrainingWalkView } from '../../../core/models/walk.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { formatDecimal, formatHms } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-training-walk-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './training-walk-list.component.html'
})
export class TrainingWalkListComponent implements OnInit {
  private walksService = inject(WalksService);

  walks: TrainingWalkView[] = [];
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
    this.walksService.getTrainingWalkViews({}).subscribe({
      next: walks => {
        this.walks = walks.sort((a, b) => new Date(b.WalkDate).getTime() - new Date(a.WalkDate).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load training walks. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
