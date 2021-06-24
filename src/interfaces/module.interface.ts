import { Access } from "./access.interface";
import { Menu } from "./menu.interface";

export interface Module {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  menus?: Menu[];
  access?: Access[];
}
