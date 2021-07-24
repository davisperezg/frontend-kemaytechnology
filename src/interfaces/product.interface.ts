import { Brand } from "./brand.interface";
import { Category } from "./category.interface";
import { Model } from "./model.interface";

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category | any;
  brand: Brand | any;
  model: Model | any;
}
