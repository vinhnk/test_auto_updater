export interface AuthResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiredTime: string | null;
    refreshTokenExpiredTime: string | null;
  }
} 