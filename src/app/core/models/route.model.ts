import { IEntity } from './common.model';

export interface RouteType extends IEntity {
  EnumId: number;
  Name: string;
}

export interface Route extends IEntity {
  Name: string;
  City?: string | null;
  State?: string | null;
  TypeId: number;
  Rating: number;
  Notes?: string | null;
  Type?: RouteType | null;
}

export interface RouteDirection extends IEntity {
  RouteId: number;
  DirectionNumber: number;
  DirectionMileMarker: number;
  DirectionDescription?: string | null;
}
