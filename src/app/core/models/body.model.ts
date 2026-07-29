import { IEntity } from './common.model';

export interface Weight extends IEntity {
  Date: string;
  Quantity: number;
  BodyFatPercentage: number;
  Notes?: string | null;
}
