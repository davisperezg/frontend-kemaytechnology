export interface Device {
  id?: string;
  name: string;
  reference?: string;
  commands?: string;
  commandsclient?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
