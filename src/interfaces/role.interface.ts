import { Module } from "./module.interface";

export interface Role {
  id?: string;
  name: string;
  modules: Module[];
}
