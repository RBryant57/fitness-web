import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RunsService } from '../../../core/services/runs.service';
import { TreadmillRunView } from '../../../core/models/run.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';
import { formatDecimal, formatHms } from '../../../shared/utils/format.util';

@Component({
  selector: 'app-treadmill-run-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './treadmill-run-list.component.html'
})
export class TreadmillRunListComponent implements OnInit {
  private runsService = inject(RunsService);

  runs: TreadmillRunView[] = [];
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
    this.runsService.getTreadmillRunViews({}).subscribe({
      next: runs => {
        this.runs = runs.sort((a, b) => new Date(b.RunDate).getTime() - new Date(a.RunDate).getTime());
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load treadmill runs. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
