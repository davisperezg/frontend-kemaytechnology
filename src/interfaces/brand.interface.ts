import { Category } from "./category.interface";

export interface Brand {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category | any;
}
