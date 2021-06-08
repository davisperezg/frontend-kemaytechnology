import { Access } from "./access.interface";
import { Menu } from "./menu.interface";

export interface Module {
  id?: string;
  name: string;
  menus?: Menu[];
  access?: Access[];
}
