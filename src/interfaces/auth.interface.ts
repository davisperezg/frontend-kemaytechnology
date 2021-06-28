export interface Login {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  currentPassword?: string;
  newPassword: string;
  confirmNewPassword: string;
}
