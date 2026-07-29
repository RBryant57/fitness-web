import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PartsService } from '../../../core/services/parts.service';
import { ManufacturersService } from '../../../core/services/manufacturers.service';
import { Part, PartType, Manufacturer } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-part-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './part-list.component.html'
})
export class PartListComponent implements OnInit {
  private partsService = inject(PartsService);
  private manufacturersService = inject(ManufacturersService);

  parts: Part[] = [];
  manufacturersById = new Map<number, Manufacturer>();
  partTypesById = new Map<number, PartType>();
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.manufacturersService.getAll().subscribe(list => {
      this.manufacturersById = new Map(list.filter(m => m.Id != null).map(m => [m.Id as number, m]));
    });
    this.partsService.getPartTypes().subscribe(list => {
      this.partTypesById = new Map(list.filter(t => t.Id != null).map(t => [t.Id as number, t]));
    });

    this.partsService.getAll().subscribe({
      next: parts => {
        this.parts = parts;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load parts. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
