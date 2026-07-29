// Base contract shared by every entity returned from the API.
// PascalCase property names are intentional: the backend serializes with
// Newtonsoft.Json and no camelCase contract resolver is configured.
export interface IEntity {
  Id?: number | null;
}

// Mirrors QuantityRequest.cs — the generic filter payload used by most
// POST-based "list" and "aggregate" endpoints across the API.
export interface QuantityRequest {
  StartDate?: string | null;
  EndDate?: string | null;
  EquipmentId?: number | null;
  EquipmentName?: string | null;
  TypeId?: number | null;
  RouteId?: number | null;
}

// Mirrors GpxRequest.cs — used by the Rides/Runs/Walks "post" endpoints
// that accept a GPX track alongside the exercise entity.
export interface GpxRequest {
  TrainingRide?: unknown;
  TrainingRun?: unknown;
  TrainingWalk?: unknown;
  RecreationalRide?: unknown;
  RecreationalRun?: unknown;
  RecreationalWalk?: unknown;
  Gpx?: string | null;
}

export interface GpxJson {
  Id: number;
  GpsData: string;
}
