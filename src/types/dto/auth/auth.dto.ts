/**
 * 인증 관련 DTO 정의
 */

import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123!',
  })
  password: string;
}

export class TokenDataDto {
  @ApiProperty({
    description: '액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '로그인이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '토큰 데이터',
    type: TokenDataDto,
  })
  data: TokenDataDto;
}

export class RegisterRequestDto {
  @ApiProperty({
    description: '사용자 ID (로그인용)',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123!',
  })
  password: string;

  @ApiProperty({
    description: '비밀번호 확인',
    example: 'password123!',
  })
  confirmPassword: string;

  @ApiProperty({
    description: '전화번호 (선택)',
    example: '010-1234-5678',
    required: false,
  })
  phoneNumber?: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '회원가입이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '토큰 데이터',
    type: TokenDataDto,
  })
  data: TokenDataDto;
}

export class DeleteUserRequestDto {
  @ApiProperty({
    description: '삭제할 사용자 ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: '사용자 비밀번호 (본인 확인용)',
    example: 'password123!',
  })
  password: string;
}

export class DeleteUserResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자가 성공적으로 삭제되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '삭제된 사용자 정보',
    example: { userId: 'user123' },
  })
  data: { userId: string };
}
