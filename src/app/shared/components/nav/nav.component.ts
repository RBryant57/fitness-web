import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  groups: NavGroup[] = [
    {
      title: 'Overview',
      links: [{ label: 'Dashboard', path: '/dashboard' }]
    },
    {
      title: 'Training Log',
      links: [
        { label: 'Training Rides', path: '/rides/training' },
        { label: 'Recreational Rides', path: '/rides/recreational' },
        { label: 'Stationary Rides', path: '/rides/stationary' },
        { label: 'Training Runs', path: '/runs/training' },
        { label: 'Recreational Runs', path: '/runs/recreational' },
        { label: 'Treadmill Runs', path: '/runs/treadmill' },
        { label: 'Training Walks', path: '/walks/training' },
        { label: 'Recreational Walks', path: '/walks/recreational' }
      ]
    },
    {
      title: 'Strength',
      links: [
        { label: 'Lifting Sessions', path: '/lifting-sessions' },
        { label: 'Circuits', path: '/circuits' },
        { label: 'Circuit Components', path: '/circuits/components' }
      ]
    },
    {
      title: 'Equipment',
      links: [
        { label: 'Bikes', path: '/bikes' },
        { label: 'Shoes', path: '/shoes' },
        { label: 'Parts', path: '/parts' },
        { label: 'Part Types', path: '/parts/types' },
        { label: 'Manufacturers', path: '/manufacturers' }
      ]
    },
    {
      title: 'Routes',
      links: [
        { label: 'Routes', path: '/routes' },
        { label: 'Route Types', path: '/routes/types' }
      ]
    },
    {
      title: 'Body',
      links: [
        { label: 'Weight Log', path: '/weights' },
        { label: 'Body Stats', path: '/body-stats' }
      ]
    },
    {
      title: 'Analytics',
      links: [
        { label: 'Mileage', path: '/analytics/miles' },
        { label: 'Weather', path: '/analytics/weather' }
      ]
    }
  ];
}
