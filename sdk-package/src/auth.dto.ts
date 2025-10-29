/**
 * 인증 관련 DTO 정의
 */


export interface LoginRequestDto {
  userId: string;

  password: string;
}

export interface TokenDataDto {
  accessToken: string;

  refreshToken: string;
}

export interface LoginResponseDto {
  success: boolean;

  message: string;

  data: TokenDataDto;
}

export interface RegisterRequestDto {
  userId: string;

  name: string;

  email: string;

  password: string;

  confirmPassword: string;

  phoneNumber?: string;
}

export interface RegisterResponseDto {
  success: boolean;

  message: string;

  data: TokenDataDto;
}

export interface DeleteUserRequestDto {
  userId: string;

  password: string;
}

export interface DeleteUserResponseDto {
  success: boolean;

  message: string;

  data: { userId: string };
}

export interface LogoutDataDto {
  userId: string;

  logoutAt: string;
}

export interface LogoutResponseDto {
  success: boolean;

  message: string;

  data: LogoutDataDto;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  success: boolean;

  message: string;

  data: TokenDataDto;
}
