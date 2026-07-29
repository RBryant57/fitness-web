import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // ---- Rides ----
  {
    path: 'rides/training',
    loadComponent: () =>
      import('./features/rides/training-ride-list/training-ride-list.component').then(m => m.TrainingRideListComponent)
  },
  {
    path: 'rides/training/new',
    loadComponent: () =>
      import('./features/rides/training-ride-form/training-ride-form.component').then(m => m.TrainingRideFormComponent)
  },
  {
    path: 'rides/recreational',
    loadComponent: () =>
      import('./features/rides/recreational-ride-list/recreational-ride-list.component').then(
        m => m.RecreationalRideListComponent
      )
  },
  {
    path: 'rides/recreational/new',
    loadComponent: () =>
      import('./features/rides/recreational-ride-form/recreational-ride-form.component').then(
        m => m.RecreationalRideFormComponent
      )
  },
  {
    path: 'rides/stationary',
    loadComponent: () =>
      import('./features/rides/stationary-ride-list/stationary-ride-list.component').then(
        m => m.StationaryRideListComponent
      )
  },
  {
    path: 'rides/stationary/new',
    loadComponent: () =>
      import('./features/rides/stationary-ride-form/stationary-ride-form.component').then(
        m => m.StationaryRideFormComponent
      )
  },

  // ---- Runs ----
  {
    path: 'runs/training',
    loadComponent: () =>
      import('./features/runs/training-run-list/training-run-list.component').then(m => m.TrainingRunListComponent)
  },
  {
    path: 'runs/training/new',
    loadComponent: () =>
      import('./features/runs/training-run-form/training-run-form.component').then(m => m.TrainingRunFormComponent)
  },
  {
    path: 'runs/recreational',
    loadComponent: () =>
      import('./features/runs/recreational-run-list/recreational-run-list.component').then(
        m => m.RecreationalRunListComponent
      )
  },
  {
    path: 'runs/recreational/new',
    loadComponent: () =>
      import('./features/runs/recreational-run-form/recreational-run-form.component').then(
        m => m.RecreationalRunFormComponent
      )
  },
  {
    path: 'runs/treadmill',
    loadComponent: () =>
      import('./features/runs/treadmill-run-list/treadmill-run-list.component').then(m => m.TreadmillRunListComponent)
  },
  {
    path: 'runs/treadmill/new',
    loadComponent: () =>
      import('./features/runs/treadmill-run-form/treadmill-run-form.component').then(m => m.TreadmillRunFormComponent)
  },

  // ---- Walks ----
  {
    path: 'walks/training',
    loadComponent: () =>
      import('./features/walks/training-walk-list/training-walk-list.component').then(m => m.TrainingWalkListComponent)
  },
  {
    path: 'walks/training/new',
    loadComponent: () =>
      import('./features/walks/training-walk-form/training-walk-form.component').then(m => m.TrainingWalkFormComponent)
  },
  {
    path: 'walks/recreational',
    loadComponent: () =>
      import('./features/walks/recreational-walk-list/recreational-walk-list.component').then(
        m => m.RecreationalWalkListComponent
      )
  },
  {
    path: 'walks/recreational/new',
    loadComponent: () =>
      import('./features/walks/recreational-walk-form/recreational-walk-form.component').then(
        m => m.RecreationalWalkFormComponent
      )
  },

  // ---- Equipment: Bikes ----
  {
    path: 'bikes',
    loadComponent: () => import('./features/bikes/bike-list/bike-list.component').then(m => m.BikeListComponent)
  },
  {
    path: 'bikes/new',
    loadComponent: () => import('./features/bikes/bike-form/bike-form.component').then(m => m.BikeFormComponent)
  },
  {
    path: 'bikes/:id/edit',
    loadComponent: () => import('./features/bikes/bike-form/bike-form.component').then(m => m.BikeFormComponent)
  },

  // ---- Equipment: Shoes ----
  {
    path: 'shoes',
    loadComponent: () => import('./features/shoes/shoe-list/shoe-list.component').then(m => m.ShoeListComponent)
  },
  {
    path: 'shoes/new',
    loadComponent: () => import('./features/shoes/shoe-form/shoe-form.component').then(m => m.ShoeFormComponent)
  },
  {
    path: 'shoes/:id/edit',
    loadComponent: () => import('./features/shoes/shoe-form/shoe-form.component').then(m => m.ShoeFormComponent)
  },

  // ---- Equipment: Parts & Part Types ----
  {
    path: 'parts/types',
    loadComponent: () =>
      import('./features/parts/part-type-list/part-type-list.component').then(m => m.PartTypeListComponent)
  },
  {
    path: 'parts/types/new',
    loadComponent: () =>
      import('./features/parts/part-type-form/part-type-form.component').then(m => m.PartTypeFormComponent)
  },
  {
    path: 'parts/types/:id/edit',
    loadComponent: () =>
      import('./features/parts/part-type-form/part-type-form.component').then(m => m.PartTypeFormComponent)
  },
  {
    path: 'parts',
    loadComponent: () => import('./features/parts/part-list/part-list.component').then(m => m.PartListComponent)
  },
  {
    path: 'parts/new',
    loadComponent: () => import('./features/parts/part-form/part-form.component').then(m => m.PartFormComponent)
  },
  {
    path: 'parts/:id/edit',
    loadComponent: () => import('./features/parts/part-form/part-form.component').then(m => m.PartFormComponent)
  },

  // ---- Equipment: Manufacturers ----
  {
    path: 'manufacturers',
    loadComponent: () =>
      import('./features/manufacturers/manufacturer-list/manufacturer-list.component').then(
        m => m.ManufacturerListComponent
      )
  },
  {
    path: 'manufacturers/new',
    loadComponent: () =>
      import('./features/manufacturers/manufacturer-form/manufacturer-form.component').then(
        m => m.ManufacturerFormComponent
      )
  },
  {
    path: 'manufacturers/:id/edit',
    loadComponent: () =>
      import('./features/manufacturers/manufacturer-form/manufacturer-form.component').then(
        m => m.ManufacturerFormComponent
      )
  },

  // ---- Routes: Route Types & Routes ----
  {
    path: 'routes/types',
    loadComponent: () =>
      import('./features/routes-mgmt/route-type-list/route-type-list.component').then(m => m.RouteTypeListComponent)
  },
  {
    path: 'routes/types/new',
    loadComponent: () =>
      import('./features/routes-mgmt/route-type-form/route-type-form.component').then(m => m.RouteTypeFormComponent)
  },
  {
    path: 'routes/types/:id/edit',
    loadComponent: () =>
      import('./features/routes-mgmt/route-type-form/route-type-form.component').then(m => m.RouteTypeFormComponent)
  },
  {
    path: 'routes',
    loadComponent: () =>
      import('./features/routes-mgmt/route-list/route-list.component').then(m => m.RouteListComponent)
  },
  {
    path: 'routes/new',
    loadComponent: () =>
      import('./features/routes-mgmt/route-form/route-form.component').then(m => m.RouteFormComponent)
  },
  {
    path: 'routes/:id/edit',
    loadComponent: () =>
      import('./features/routes-mgmt/route-form/route-form.component').then(m => m.RouteFormComponent)
  },

  // ---- Strength: Circuits & Components ----
  {
    path: 'circuits/components',
    loadComponent: () =>
      import('./features/circuits/circuit-component-list/circuit-component-list.component').then(
        m => m.CircuitComponentListComponent
      )
  },
  {
    path: 'circuits/components/new',
    loadComponent: () =>
      import('./features/circuits/circuit-component-form/circuit-component-form.component').then(
        m => m.CircuitComponentFormComponent
      )
  },
  {
    path: 'circuits/components/:id/edit',
    loadComponent: () =>
      import('./features/circuits/circuit-component-form/circuit-component-form.component').then(
        m => m.CircuitComponentFormComponent
      )
  },
  {
    path: 'circuits',
    loadComponent: () => import('./features/circuits/circuit-list/circuit-list.component').then(m => m.CircuitListComponent)
  },
  {
    path: 'circuits/new',
    loadComponent: () => import('./features/circuits/circuit-form/circuit-form.component').then(m => m.CircuitFormComponent)
  },
  {
    path: 'circuits/:id/edit',
    loadComponent: () => import('./features/circuits/circuit-form/circuit-form.component').then(m => m.CircuitFormComponent)
  },

  // ---- Strength: Lifting Sessions ----
  {
    path: 'lifting-sessions',
    loadComponent: () =>
      import('./features/lifting-sessions/lifting-session-list/lifting-session-list.component').then(
        m => m.LiftingSessionListComponent
      )
  },
  {
    path: 'lifting-sessions/new',
    loadComponent: () =>
      import('./features/lifting-sessions/lifting-session-form/lifting-session-form.component').then(
        m => m.LiftingSessionFormComponent
      )
  },
  {
    path: 'lifting-sessions/:id/edit',
    loadComponent: () =>
      import('./features/lifting-sessions/lifting-session-form/lifting-session-form.component').then(
        m => m.LiftingSessionFormComponent
      )
  },

  // ---- Body ----
  {
    path: 'weights',
    loadComponent: () => import('./features/weights/weight-list/weight-list.component').then(m => m.WeightListComponent)
  },
  {
    path: 'weights/new',
    loadComponent: () => import('./features/weights/weight-form/weight-form.component').then(m => m.WeightFormComponent)
  },
  {
    path: 'weights/:id/edit',
    loadComponent: () => import('./features/weights/weight-form/weight-form.component').then(m => m.WeightFormComponent)
  },
  {
    path: 'body-stats',
    loadComponent: () => import('./features/body-stats/body-stats.component').then(m => m.BodyStatsComponent)
  },

  // ---- Analytics ----
  {
    path: 'analytics/miles',
    loadComponent: () =>
      import('./features/analytics/miles-analytics/miles-analytics.component').then(m => m.MilesAnalyticsComponent)
  },
  {
    path: 'analytics/weather',
    loadComponent: () =>
      import('./features/analytics/weather-analytics/weather-analytics.component').then(
        m => m.WeatherAnalyticsComponent
      )
  },

  { path: '**', redirectTo: 'dashboard' }
];
