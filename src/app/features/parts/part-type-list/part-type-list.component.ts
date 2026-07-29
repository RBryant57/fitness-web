import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PartsService } from '../../../core/services/parts.service';
import { PartType } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-part-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './part-type-list.component.html'
})
export class PartTypeListComponent implements OnInit {
  private partsService = inject(PartsService);

  partTypes: PartType[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.partsService.getPartTypes().subscribe({
      next: types => {
        this.partTypes = types;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load part types. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
