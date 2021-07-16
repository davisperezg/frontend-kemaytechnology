import { Category } from "./category.interface";

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: string;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category;
}
