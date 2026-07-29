import { IEntity } from './common.model';

// Mirrors ExerciseBase.cs — the fields common to every training/recreational
// exercise entity (rides, runs, walks).
export interface ExerciseBase extends IEntity {
  AverageHr: number;
  ElevationGain: number;
  EndTime: string;
  EquipmentId?: number | null;
  ExerciseDate: string;
  MaxHr: number;
  MaxSpeed: number;
  Notes?: string | null;
  Quantity?: number | null;
  Precipitation: boolean;
  RouteId: number;
  AverageCadence: number;
  StartTime: string;
  Temperature: number;
}
