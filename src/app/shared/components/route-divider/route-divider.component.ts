import { Component } from '@angular/core';

@Component({
  selector: 'app-route-divider',
  standalone: true,
  template: `
    <svg class="route-divider" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,10 C40,2 60,18 100,10 C140,2 160,18 200,10 C240,2 260,18 300,10 C340,2 360,18 400,10" />
    </svg>
  `
})
export class RouteDividerComponent {}
