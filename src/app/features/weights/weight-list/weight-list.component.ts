import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WeightsService } from '../../../core/services/weights.service';
import { Weight } from '../../../core/models/body.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-weight-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './weight-list.component.html'
})
export class WeightListComponent implements OnInit {
  private weightsService = inject(WeightsService);

  weights: Weight[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.weightsService.getAll().subscribe({
      next: weights => {
        this.weights = weights.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load weight readings. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
