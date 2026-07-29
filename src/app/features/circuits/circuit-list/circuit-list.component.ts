import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CircuitsService } from '../../../core/services/circuits.service';
import { Circuit } from '../../../core/models/strength.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-circuit-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './circuit-list.component.html'
})
export class CircuitListComponent implements OnInit {
  private circuitsService = inject(CircuitsService);

  circuits: Circuit[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.circuitsService.getAll().subscribe({
      next: circuits => {
        this.circuits = circuits;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load circuits. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
