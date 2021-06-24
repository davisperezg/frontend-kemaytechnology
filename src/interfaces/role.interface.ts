import { Module } from "./module.interface";

export interface Role {
  id?: string;
  name: string;
  description?: string;
  email?: string;
  modules?: Module[];
  createdAt?: Date;
  updatedAt?: Date;
}
