import { IEntity } from './common.model';

export interface Circuit extends IEntity {
  Name: string;
  Notes?: string | null;
}

export interface CircuitComponent extends IEntity {
  ExerciseName: string;
  Notes?: string | null;
}

export interface CircuitsComponent extends IEntity {
  CircuitId: number;
  CircuitComponentId: number;
}

export interface LiftingSession extends IEntity {
  Date: string;
  CircuitId: number;
  NumberOfSets: number;
  Notes?: string | null;
  Circuit?: Circuit | null;
}
