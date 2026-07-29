import { ExerciseBase } from './exercise-base.model';
import { IEntity } from './common.model';

export interface TrainingWalk extends ExerciseBase {
  WalkTimeHours: number;
  WalkTimeMinutes: number;
  WalkTimeSeconds: number;
  WindSpeed: number;
  WindDirection?: string | null;
  GpxJsonId?: number | null;
  NumberOfAttempts: number;
  NumberOfSuccesses: number;
}

export interface TrainingWalkView extends IEntity {
  WalkDate: string;
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

export interface RecreationalWalk extends ExerciseBase {
  WalkTimeHours: number;
  WalkTimeMinutes: number;
  WalkTimeSeconds: number;
  PathEndTime: string;
  PathTimeHours: number;
  PathTimeMinutes: number;
  PathTimeSeconds: number;
  Wind?: string | null;
  GpxJsonId?: number | null;
}

export interface RecreationalWalkView extends IEntity {
  WalkDate: string;
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
