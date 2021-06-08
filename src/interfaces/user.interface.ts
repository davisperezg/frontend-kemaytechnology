import { Role } from "./role.interface";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: Role;
}
