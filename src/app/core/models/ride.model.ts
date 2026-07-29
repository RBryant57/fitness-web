import { ExerciseBase } from './exercise-base.model';
import { IEntity } from './common.model';

export interface TrainingRide extends ExerciseBase {
  StartOdometer: number;
  EndOdometer: number;
  RideTimeHours: number;
  RideTimeMinutes: number;
  RideTimeSeconds: number;
  WindSpeed: number;
  WindDirection?: string | null;
  GpxJsonId?: number | null;
  NumberOfAttempts: number;
  NumberOfSuccesses: number;
}

export interface TrainingRideView extends IEntity {
  RideDate: string;
  StartingTime: string;
  EndingTime: string;
  Hours: number;
  Minutes: number;
  Seconds: number;
  StatedDistance: number;
  Distance?: number | null;
  Speed?: number | null;
  Pace?: number | null;
  MaximumSpeed: number;
  AverageHr: number;
  MaximumHr: number;
  AverageCadence: number;
  ElevationGain: number;
  WindSpeed: number;
  WindDirection?: string | null;
  Temperature: number;
  Precipitation: boolean;
  BikeName?: string | null;
  BikeType?: string | null;
  RouteName?: string | null;
  City?: string | null;
  State?: string | null;
  RouteType?: string | null;
  Notes?: string | null;
  Gpx?: string | null;
}

export interface RecreationalRide extends ExerciseBase {
  StartOdometer: number;
  EndOdometer: number;
  RideTimeHours: number;
  RideTimeMinutes: number;
  RideTimeSeconds: number;
  BikeEndTime: string;
  BikeTimeHours: number;
  BikeTimeMinutes: number;
  BikeTimeSeconds: number;
  Wind?: string | null;
  GpxJsonId?: number | null;
}

export interface RecreationalRideView extends IEntity {
  RideDate: string;
  StartingTime: string;
  EndingTime: string;
  BikeEndingTime: string;
  Hours: number;
  Minutes: number;
  Seconds: number;
  BikeHours: number;
  BikeMinutes: number;
  BikeSeconds: number;
  Distance?: number | null;
  StatedDistance: number;
  Speed?: number | null;
  Pace?: number | null;
  MaximumSpeed: number;
  OverallSpeed?: number | null;
  OverallPace?: number | null;
  AverageHr: number;
  MaximumHr: number;
  AverageCadence: number;
  ElevationGain: number;
  Wind?: string | null;
  Temperature: number;
  Precipitation: boolean;
  BikeName?: string | null;
  BikeType?: string | null;
  RouteName?: string | null;
  City?: string | null;
  State?: string | null;
  RouteType?: string | null;
  Notes?: string | null;
  Gpx?: string | null;
}

// StationaryRide inherits ExerciseBase in C#; RouteId/ElevationGain/MaxSpeed/
// Precipitation/Temperature are marked [NotMapped] (not persisted to the DB)
// but still exist on the wire. The create form only surfaces the fields that
// are actually meaningful for a stationary/trainer ride.
export interface StationaryRide extends ExerciseBase {
  StartOdometer: number;
  EndOdometer: number;
  RideTimeHours: number;
  RideTimeMinutes: number;
  RideTimeSeconds: number;
}

export interface StationaryRideView extends IEntity {
  RideDate: string;
  StartingTime: string;
  EndingTime: string;
  Hours: number;
  Minutes: number;
  Seconds: number;
  Distance?: number | null;
  Speed?: number | null;
  Pace?: number | null;
  AverageHr: number;
  MaximumHr: number;
  AverageCadence: number;
  Notes?: string | null;
  BikeName?: string | null;
  BikeType?: string | null;
}
