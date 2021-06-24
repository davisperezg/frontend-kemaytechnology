import { Role } from "./role.interface";

export interface User {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  role?: Role;
  password?: string;
  confirmPassword?: string;
}
