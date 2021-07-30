import { Brand } from "./brand.interface";
import { Category } from "./category.interface";
import { Model } from "./model.interface";
import { Product } from "./product.interface";
import { Service } from "./service.interface";

export interface CheckProduct {
  category: Category | any;
  brand: Brand | any;
  model: Model | any;
  product: Product | any;
  service: Service | any;
}
