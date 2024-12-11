export interface RegisterDto {
  name: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    fullname: string;
    // email: string;
    phone_number: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// * LOGIN
export interface LoginCredentials {
  // email: string;
  phone_number: string;
  password: string;
}

export interface User {
  id: number;
  // email: string,
  fullname: string;
  phone_number: string;
  role: string;
}

export interface UserInfo {
  id: number;
  email: string,
  fullname: string;
  phone_number: string;
  gender: "MALE" | "FEMALE";
  role: "ADMIN" | "USER";
  birthday: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}