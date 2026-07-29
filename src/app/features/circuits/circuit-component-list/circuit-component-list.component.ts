import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CircuitsService } from '../../../core/services/circuits.service';
import { CircuitComponent } from '../../../core/models/strength.model';
import { RouteDividerComponent } from '../../../shared/components/route-divider/route-divider.component';

@Component({
  selector: 'app-circuit-component-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteDividerComponent],
  templateUrl: './circuit-component-list.component.html'
})
export class CircuitComponentListComponent implements OnInit {
  private circuitsService = inject(CircuitsService);

  components: CircuitComponent[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.circuitsService.getComponents().subscribe({
      next: components => {
        this.components = components;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load circuit components. Confirm the API is running and reachable.';
        this.loading = false;
      }
    });
  }
}
