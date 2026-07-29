import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BodyService } from '../../core/services/body.service';
import { Weight } from '../../core/models/body.model';
import { RouteDividerComponent } from '../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../shared/utils/format.util';

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

@Component({
  selector: 'app-body-stats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouteDividerComponent],
  templateUrl: './body-stats.component.html'
})
export class BodyStatsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bodyService = inject(BodyService);

  loading = true;
  error: string | null = null;
  averageGymHours: number | null = null;
  totalGymHours: number | null = null;
  weightReadings: Weight[] = [];

  filterForm = this.fb.nonNullable.group({
    startDate: [toDateInput(daysAgo(90))],
    endDate: [toDateInput(new Date().toISOString())]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    const v = this.filterForm.getRawValue();
    const request = { StartDate: v.startDate, EndDate: v.endDate };

    this.bodyService.getAverageGymHours(request).subscribe({
      next: hours => (this.averageGymHours = hours),
      error: () => (this.averageGymHours = null)
    });
    this.bodyService.getTotalGymHours(request).subscribe({
      next: hours => (this.totalGymHours = hours),
      error: () => (this.totalGymHours = null)
    });
    this.bodyService.getWeightReadings(request).subscribe({
      next: readings => {
        this.weightReadings = readings.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load body stats. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
