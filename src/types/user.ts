export interface RegisterUser {
  confirmPassword: string
  password: string
  fullName: string
  email: string
}

export interface LoginResponse {
  user: UserType;
  accessToken: string | null;
  refreshToken: string;
  role: string;
}

export interface UserType {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: null | string;
}