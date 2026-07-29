import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShoesService } from '../../../core/services/shoes.service';
import { Shoe } from '../../../core/models/equipment.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-shoe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './shoe-list.component.html'
})
export class ShoeListComponent implements OnInit {
  private shoesService = inject(ShoesService);

  shoes: Shoe[] = [];
  loading = true;
  error: string | null = null;
  retiringId: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.shoesService.getAllIncludingRetired(true).subscribe({
      next: shoes => {
        this.shoes = shoes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load shoes. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }

  retire(shoe: Shoe): void {
    if (!shoe.Id || this.retiringId) {
      return;
    }
    this.retiringId = shoe.Id;
    this.shoesService
      .retireShoe({ EquipmentId: shoe.Id, StartDate: new Date().toISOString() })
      .subscribe({
        next: () => {
          this.retiringId = null;
          this.load();
        },
        error: () => {
          this.retiringId = null;
          this.error = 'Could not retire this shoe.';
        }
      });
  }
}
