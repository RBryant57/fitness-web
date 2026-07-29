import { IEntity } from './common.model';

export interface Manufacturer extends IEntity {
  Name: string;
  Notes?: string | null;
}

// BikeType has no dedicated API endpoint (BikesController does not expose
// it), so TypeId is entered as a plain number in the UI rather than backed
// by a dropdown.
export interface Bike extends IEntity {
  Name: string;
  ManufacturerId: number;
  TypeId: number;
  AcquisitionDate: string;
  BaseMiles: number;
  Notes?: string | null;
  Age?: number;
  Manufacturer?: Manufacturer | null;
}

export interface ShoeType extends IEntity {
  EnumId: number;
  Name: string;
}

export interface Shoe extends IEntity {
  Name: string;
  ManufacturerId: number;
  ShoeTypeId: number;
  AcquisitionDate: string;
  RetireDate?: string | null;
  Notes?: string | null;
  Age?: number;
  Manufacturer?: Manufacturer | null;
  ShoeType?: ShoeType | null;
}

export interface PartType extends IEntity {
  Name: string;
  Notes?: string | null;
}

export interface Part extends IEntity {
  ManufacturerId: number;
  PartTypeId: number;
  Name: string;
  Notes?: string | null;
  Manufacturer?: Manufacturer | null;
  PartType?: PartType | null;
}

export interface PartAge {
  AgeInDays: number;
  AgeInMiles: number;
  PartName: string;
  StartDate: string;
}

export interface BikePart extends IEntity {
  BikeId: number;
  PartId: number;
  StartDate: string;
  EndDate?: string | null;
  OdometerReading: number;
}

export interface NonRideMile extends IEntity {
  Date: string;
  StartOdometer: number;
  EndOdometer: number;
  BikeId: number;
  Notes?: string | null;
}
