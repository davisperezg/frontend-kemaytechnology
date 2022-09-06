import { Billing } from "./billing.interface";
import { Vehicle } from "./vehicle.interface";

export interface Renew {
  id?: string;
  vehicle: Vehicle | any;
  billing: Billing | any;
  billingPayToday: string;
  billingTime: any[];
  billingDes: string;
  expirationDate?: Date | string;
  renovationStart?: Date | string;
  renovationEnd?: Date | string;
}
