import { Billing } from "./billing.interface";
import { Customer } from "./customer.interface";
import { Device } from "./device.interface";
import { User } from "./user.interface";

export interface Vehicle {
  id?: string;
  customer: Customer | any;
  device: Device | any;
  billing: Billing | any;
  plate: string;
  nroGPS: string;
  platform: string;
  sim: string;
  billigStart: string | Date;
  billigEnd?: string | Date;
  createdBy?: User | any;
  updatedBy?: User | any;
  createdAt?: Date;
  updatedAt?: Date;
}
