import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { WeatherService } from '../../../core/services/weather.service';
import { WORKOUT_TYPE_OPTIONS, WindDirectionStat } from '../../../core/models/analytics.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { toDateInput } from '../../../shared/utils/format.util';

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

@Component({
  selector: 'app-weather-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouteDividerComponent],
  templateUrl: './weather-analytics.component.html'
})
export class WeatherAnalyticsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private weatherService = inject(WeatherService);

  workoutTypes = WORKOUT_TYPE_OPTIONS;
  loading = true;
  error: string | null = null;
  averageTemperature: number | null = null;
  averageWindSpeed: number | null = null;
  rainDays: number | null = null;
  windDistribution: WindDirectionStat[] = [];

  filterForm = this.fb.nonNullable.group({
    startDate: [toDateInput(daysAgo(180))],
    endDate: [toDateInput(new Date().toISOString())],
    typeId: [null as number | null]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    const v = this.filterForm.getRawValue();
    const request = { StartDate: v.startDate, EndDate: v.endDate, TypeId: v.typeId };

    this.weatherService.getAverageTemperature(request).subscribe({
      next: t => (this.averageTemperature = t),
      error: () => (this.averageTemperature = null)
    });
    this.weatherService.getAverageWindSpeed(request).subscribe({
      next: w => (this.averageWindSpeed = w),
      error: () => (this.averageWindSpeed = null)
    });
    this.weatherService.getRainDays(request).subscribe({
      next: r => (this.rainDays = r),
      error: () => (this.rainDays = null)
    });
    this.weatherService.getWindDistribution(request).subscribe({
      next: dist => {
        this.windDistribution = dist;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load weather data. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
