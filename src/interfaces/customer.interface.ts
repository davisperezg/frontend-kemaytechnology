export interface Customer {
  id?: string;
  name: string;
  lastName?: string;
  document: string;
  numDocument: string;
  cellphone_1: string;
  cellphone_2?: string;
  direction?: string;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  fecha_nac?: Date | string;
}
