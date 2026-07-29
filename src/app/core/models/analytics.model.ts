import { IEntity } from './common.model';

export interface MileageDistribution {
  Miles: number;
  NumberOfSessions: number;
  PeriodName: string;
  PeriodNumber: number;
}

export interface WindDirectionStat {
  Direction: string;
  Frequency: number;
}

export interface ExerciseType extends IEntity {
  Name: string;
}

// ExerciseType has no CRUD endpoint exposed, so MissedMile.ExerciseTypeId
// is entered as a plain number in the UI.
export interface MissedMile extends IEntity {
  Date: string;
  Miles: number;
  ExerciseTypeId: number;
  Notes?: string | null;
}

export interface BikeOnlyMile extends IEntity {
  Date: string;
  StartOdometer: number;
  EndOdometer: number;
  BikeId: number;
  Notes?: string | null;
}

export interface OutdoorIndoor {
  Rides: number;
  Miles: number;
  Date: string;
}

// WorkoutType enum values used by Miles/Weather "by type" filters.
export enum WorkoutType {
  None = 0,
  Ride = 1,
  RideWithTrainer = 2,
  TrainingRide = 3,
  RecreationalRide = 4,
  StationaryRide = 5,
  StationaryRideWithoutTrainer = 6,
  Run = 7,
  RunWithTreadmill = 8,
  TrainingRun = 9,
  RecreationalRun = 10,
  TreadmillRun = 11,
  Walk = 12,
  TrainingWalk = 13,
  RecreationalWalk = 14,
  Lifting = 15,
  Stairs = 16
}

export const WORKOUT_TYPE_OPTIONS: { id: WorkoutType; label: string }[] = [
  { id: WorkoutType.Ride, label: 'Ride' },
  { id: WorkoutType.RideWithTrainer, label: 'Ride (with trainer)' },
  { id: WorkoutType.TrainingRide, label: 'Training Ride' },
  { id: WorkoutType.RecreationalRide, label: 'Recreational Ride' },
  { id: WorkoutType.StationaryRide, label: 'Stationary Ride' },
  { id: WorkoutType.StationaryRideWithoutTrainer, label: 'Stationary Ride (no trainer)' },
  { id: WorkoutType.Run, label: 'Run' },
  { id: WorkoutType.RunWithTreadmill, label: 'Run (treadmill)' },
  { id: WorkoutType.TrainingRun, label: 'Training Run' },
  { id: WorkoutType.RecreationalRun, label: 'Recreational Run' },
  { id: WorkoutType.TreadmillRun, label: 'Treadmill Run' },
  { id: WorkoutType.Walk, label: 'Walk' },
  { id: WorkoutType.TrainingWalk, label: 'Training Walk' },
  { id: WorkoutType.RecreationalWalk, label: 'Recreational Walk' },
  { id: WorkoutType.Lifting, label: 'Lifting' },
  { id: WorkoutType.Stairs, label: 'Stairs' }
];
