# Fitness Log — Angular Frontend

A complete Angular 17 (standalone components) frontend for the FitnessService ASP.NET Core API, covering all 14 controllers: Rides, Runs, Walks, Lifting Sessions, Circuits, Bikes, Shoes, Parts, Routes, Manufacturers, Miles, Weather, Body and Weights. (`ConnectionInfoController` is intentionally not surfaced in the UI — it echoes the raw DB connection string and has no end-user purpose.)

## Getting started

```bash
npm install
npm start          # ng serve, http://localhost:4200
```

### Point it at your API

Edit `src/environments/environment.ts` and set `apiBaseUrl` to your API's actual address and port:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:5001/api'   // <-- update to match your launchSettings.json
};
```

The project didn't have `launchSettings.json` available, so this is a placeholder — check your `Properties/launchSettings.json` for the real `applicationUrl` and update both `environment.ts` and `environment.prod.ts` accordingly.

Because the backend's `AddNewtonsoftJson()` has no camelCase contract resolver, the API serializes PascalCase property names (`Id`, `Name`, `StartTime`, …). Every TypeScript interface in `src/app/core/models` mirrors that convention deliberately — don't camelCase them.

## Project structure

```
src/app/
  core/
    models/      TypeScript interfaces mirroring every C# entity/view/DTO
    services/    One Angular service per controller (HttpClient wrappers)
  shared/
    components/  Nav sidebar, GPX upload field, route-line divider
    utils/       Date/duration formatting helpers
  features/
    dashboard/
    rides/       Training / Recreational / Stationary — list + create form
    runs/        Training / Recreational / Treadmill — list + create form
    walks/       Training / Recreational — list + create form
    bikes/, shoes/, parts/, manufacturers/   equipment (list + create/edit)
    routes-mgmt/                             course library (list + create/edit)
    circuits/, lifting-sessions/             strength training
    weights/, body-stats/                    body weight & gym-hours analytics
    analytics/   miles-analytics, weather-analytics
```

Routing is fully lazy-loaded per component (`loadComponent`) — see `src/app/app.routes.ts` for the full sitemap.

## Known backend quirks this frontend works around

- **`GetPartTypes(id)` / `PutPartType(id)` and `GetRouteTypes(id)` / `PutRouteType(id)`** share the same `{id}` attribute route as the sibling `GetParts(id)`/`PutPart(id)` and `GetRoutes(id)`/`PutRoute(id)` actions — an ambiguous-route conflict in `PartsController` and `RoutesController`. The frontend avoids calling those by-id endpoints: Part Type and Route Type edit forms look up the record from the already-loaded list instead of re-fetching by id.
- **`BodyController.GetMaxOdometerByBike` / `PostNonRideMiles` / `GetCurrentBikeParts`** cast the controller's `BodyData` instance to `BikeData`, which throws `InvalidCastException` at runtime. `BodyService` omits these; the same capabilities are exposed correctly through `BikesService` against `BikesController`.
- **`BikeType` and `ExerciseType`** have no CRUD endpoints anywhere in the API. The Bike form's "Type ID" field and the Miles "quick log → missed miles" form's "Exercise type ID" field are plain number inputs rather than dropdowns.
- **Delete is not implemented** on any entity — every controller's `Delete` action returns `NotFound()` before reaching the deletion code. No delete buttons are shown in the UI.

## Design

Dark "training computer" theme — mint/teal accent, `Space Grotesk` for display type, `Inter` for body copy, `JetBrains Mono` for numeric readouts (distance, pace, odometer). Tokens live in `src/styles.css` as CSS custom properties.
