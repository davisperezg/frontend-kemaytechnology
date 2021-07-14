import { Category } from "./category.interface";

export interface Brand {
  id?: string;
  name: string;
  categorys: Category[];
}
