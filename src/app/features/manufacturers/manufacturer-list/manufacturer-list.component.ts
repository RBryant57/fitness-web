import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ManufacturersService } from '../../../core/services/manufacturers.service';
import { Manufacturer } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-manufacturer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './manufacturer-list.component.html'
})
export class ManufacturerListComponent implements OnInit {
  private manufacturersService = inject(ManufacturersService);

  manufacturers: Manufacturer[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.manufacturersService.getAll().subscribe({
      next: list => {
        this.manufacturers = list;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load manufacturers. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
