import { Category } from "./category.interface";

export interface Egress {
  id?: string;
  detail: string;
  observation?: string;
  units: number;
  category: Category | any;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
