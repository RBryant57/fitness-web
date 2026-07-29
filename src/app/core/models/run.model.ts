import { ExerciseBase } from './exercise-base.model';
import { IEntity } from './common.model';

export interface TrainingRun extends ExerciseBase {
  RunTimeHours: number;
  RunTimeMinutes: number;
  RunTimeSeconds: number;
  WindSpeed: number;
  WindDirection?: string | null;
  GpxJsonId?: number | null;
  NumberOfAttempts: number;
  NumberOfSuccesses: number;
}

export interface TrainingRunView extends IEntity {
  RunDate: string;
  StartingTime: string;
  EndingTime: string;
  Hours: number;
  Minutes: number;
  Seconds: number;
  Distance: number;
  Speed?: number | null;
  Pace?: number | null;
  MaximumSpeed: number;
  AverageHr: number;
  MaximumHr: number;
  ElevationGain: number;
  WindSpeed: number;
  WindDirection?: string | null;
  Temperature: number;
  Precipitation: boolean;
  ShoeName?: string | null;
  ShoeType?: string | null;
  RouteName?: string | null;
  City?: string | null;
  State?: string | null;
  RouteType?: string | null;
  Notes?: string | null;
  Gpx?: string | null;
}

export interface RecreationalRun extends ExerciseBase {
  RunTimeHours: number;
  RunTimeMinutes: number;
  RunTimeSeconds: number;
  PathEndTime: string;
  PathTimeHours: number;
  PathTimeMinutes: number;
  PathTimeSeconds: number;
  Wind?: string | null;
  GpxJsonId?: number | null;
}

export interface RecreationalRunView extends IEntity {
  RunDate: string;
  StartingTime: string;
  EndingTime: string;
  PathEndingTime: string;
  Hours: number;
  Minutes: number;
  Seconds: number;
  PathHours: number;
  PathMinutes: number;
  PathSeconds: number;
  Distance: number;
  Speed?: number | null;
  Pace?: number | null;
  OverallSpeed?: number | null;
  OverallPace?: number | null;
  MaximumSpeed: number;
  AverageHr: number;
  MaximumHr: number;
  ElevationGain: number;
  Wind?: string | null;
  Temperature: number;
  Precipitation: boolean;
  ShoeName?: string | null;
  ShoeType?: string | null;
  RouteName?: string | null;
  City?: string | null;
  State?: string | null;
  RouteType?: string | null;
  Notes?: string | null;
  Gpx?: string | null;
}

// TreadmillRun inherits ExerciseBase; ElevationGain/MaxSpeed/Precipitation/
// RouteId/Temperature/AverageCadence are [NotMapped] placeholders inherited
// from the base class but not meaningful for an indoor treadmill run.
export interface TreadmillRun extends ExerciseBase {
  RunTimeHours: number;
  RunTimeMinutes: number;
  RunTimeSeconds: number;
}

export interface TreadmillRunView extends IEntity {
  RunDate: string;
  StartingTime: string;
  EndingTime: string;
  Hours: number;
  Minutes: number;
  Seconds: number;
  Distance: number;
  Speed?: number | null;
  Pace?: number | null;
  AverageHr: number;
  MaximumHr: number;
  ElevationGain: number;
  ShoeName?: string | null;
  ShoeType?: string | null;
  Notes?: string | null;
}
