import { Billing } from "./billing.interface";
import { Vehicle } from "./vehicle.interface";

export interface Renew {
  id?: string;
  vehicle: Vehicle | any;
  billing: Billing | any;
  expirationDate?: Date | string;
  renovationStart?: Date | string;
  renovationEnd?: Date | string;
}
