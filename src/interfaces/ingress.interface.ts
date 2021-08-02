import { Category } from "./category.interface";
import { User } from "./user.interface";

export interface Ingress {
  id?: string;
  detail: string;
  observation?: string;
  units: number;
  category: Category | any;
  user?: User | any;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
