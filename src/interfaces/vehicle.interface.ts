import { Billing } from "./billing.interface";
import { Customer } from "./customer.interface";
import { Device } from "./device.interface";
import { User } from "./user.interface";

export interface Vehicle {
  id?: string;
  customer: Customer | string;
  device: Device | string;
  billing: Billing | string;
  plate: string;
  nroGPS: string;
  platform: string;
  sim: string;
  retired: boolean;
  billigStart?: string | Date;
  billigEnd?: string | Date;
  createdBy?: User | string;
  updatedBy?: User | string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}
