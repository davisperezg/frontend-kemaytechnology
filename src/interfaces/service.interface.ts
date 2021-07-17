import { Category } from "./category.interface";

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category | any;
}
