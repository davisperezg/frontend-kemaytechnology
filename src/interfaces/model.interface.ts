import { Brand } from "./brand.interface";

export interface Model {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  brand: Brand | any;
}
