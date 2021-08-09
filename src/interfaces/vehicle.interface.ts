import { Billing } from "./billing.interface";
import { Customer } from "./customer.interface";
import { Device } from "./device.interface";

export interface Vehicle {
  id?: string;
  customer: Customer | any;
  device: Device | any;
  billing: Billing | any;
  plate: string;
  nroGPS: string;
  billigStart: string | Date;
  billigEnd?: string | Date;
  createdAt?: Date;
  updatedAt?: Date;
}
