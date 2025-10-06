/**
 * 사용자 프로필 관련 DTO 정의
 */

import { ApiProperty } from '@nestjs/swagger';

export enum UsersRolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UsersStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum UsersGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface UsersModelDto {
  /** 사용자 고유 ID  */
  id: number;
  /** 사용자 ID (로그인용) */
  userId: string;
  /** 사용자 비밀번호 */
  password: string;
  /** 사용자 이름 */
  name: string;
  /** 이메일 */
  email: string;
  /** 전화번호 */
  phoneNumber?: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /** 생년월일 */
  birthDate?: string;
  /** 성별 */
  gender?: UsersGenderEnum;
  /** 계정 생성일 */
  createdAt: string;
  /** 마지막 업데이트일 */
  updatedAt: string;
  /** 계정 상태 */
  status: UsersStatusEnum;
  /** 계정 역할 */
  role: UsersRolesEnum;
  /** 이메일 인증 여부 */
  emailVerified: boolean;
  /** 전화번호 인증 여부 */
  phoneVerified: boolean;
}
export class GetMeResponseDto {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
  })
  id: number;

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
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profileImageUrl?: string;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  birthDate?: string;

  @ApiProperty({
    description: '성별',
    enum: UsersGenderEnum,
    example: UsersGenderEnum.OTHER,
    required: false,
  })
  gender?: UsersGenderEnum;

  @ApiProperty({
    description: '계정 생성일',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '마지막 업데이트일',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: '계정 상태',
    enum: UsersStatusEnum,
    example: UsersStatusEnum.ACTIVE,
  })
  status: UsersStatusEnum;

  @ApiProperty({
    description: '계정 역할',
    enum: UsersRolesEnum,
    example: UsersRolesEnum.USER,
  })
  role: UsersRolesEnum;

  @ApiProperty({
    description: '이메일 인증 여부',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: '전화번호 인증 여부',
    example: false,
  })
  phoneVerified: boolean;
}

export interface ChangePasswordRequestDto {
  /** 현재 비밀번호 */
  currentPassword: string;
  /** 새 비밀번호 */
  newPassword: string;
  /** 새 비밀번호 확인 */
  confirmPassword: string;
}
export interface ChangePasswordResponseDto {
  /** 성공 메시지 */
  message: string;
  /** 새 토큰 발급 여부 */
  tokenRefreshRequired: boolean;
}
export interface DeleteAccountRequestDto {
  /** 비밀번호 확인 */
  password: string;
  /** 삭제 사유 */
  reason?: string;
}
export interface DeleteAccountResponseDto {
  /** 성공 메시지 */
  message: string;
  /** 계정 삭제 예정일 (Unix timestamp) */
  scheduledDeletionDate: number;
}

export class GetAllUsersResponseDto {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
  })
  id: number;

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
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profileImageUrl?: string;

  @ApiProperty({
    description: '계정 생성일',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '계정 상태',
    enum: UsersStatusEnum,
    example: UsersStatusEnum.ACTIVE,
  })
  status: UsersStatusEnum;

  @ApiProperty({
    description: '계정 역할',
    enum: UsersRolesEnum,
    example: UsersRolesEnum.USER,
  })
  role: UsersRolesEnum;

  @ApiProperty({
    description: '이메일 인증 여부',
    example: true,
  })
  emailVerified: boolean;
}

export class UpdateUserRequestDto {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'ROLE',
    enum: UsersRolesEnum,
    example: UsersRolesEnum.USER,
    required: false,
  })
  role?: UsersRolesEnum;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  birthDate?: string;

  @ApiProperty({
    description: '성별',
    enum: UsersGenderEnum,
    example: UsersGenderEnum.OTHER,
    required: false,
  })
  gender?: UsersGenderEnum;
}

export class UpdateUserResponseDto {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: 1,
  })
  id: number;

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
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  profileImageUrl?: string;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  birthDate?: string;

  @ApiProperty({
    description: '성별',
    enum: UsersGenderEnum,
    example: UsersGenderEnum.OTHER,
    required: false,
  })
  gender?: UsersGenderEnum;

  @ApiProperty({
    description: '계정 생성일',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '마지막 업데이트일',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: '계정 상태',
    enum: UsersStatusEnum,
    example: UsersStatusEnum.ACTIVE,
  })
  status: UsersStatusEnum;

  @ApiProperty({
    description: '계정 역할',
    enum: UsersRolesEnum,
    example: UsersRolesEnum.USER,
  })
  role: UsersRolesEnum;

  @ApiProperty({
    description: '이메일 인증 여부',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: '전화번호 인증 여부',
    example: false,
  })
  phoneVerified: boolean;
}
