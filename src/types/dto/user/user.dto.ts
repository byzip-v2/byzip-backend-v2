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
export class GetMeDataDto {
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

export class GetMeResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자 정보를 성공적으로 조회했습니다.',
  })
  message: string;

  @ApiProperty({
    description: '사용자 정보 데이터',
    type: GetMeDataDto,
  })
  data: GetMeDataDto;
}

export class ChangePasswordRequestDto {
  @ApiProperty({
    description: '현재 비밀번호',
    example: 'currentPassword123!',
  })
  currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newPassword123!',
  })
  newPassword: string;

  @ApiProperty({
    description: '새 비밀번호 확인',
    example: 'newPassword123!',
  })
  confirmPassword: string;
}

export class ChangePasswordDataDto {
  @ApiProperty({
    description: '새 토큰 발급 여부',
    example: false,
  })
  tokenRefreshRequired: boolean;
}

export class ChangePasswordResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '비밀번호가 성공적으로 변경되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '비밀번호 변경 데이터',
    type: ChangePasswordDataDto,
  })
  data: ChangePasswordDataDto;
}
export class DeleteAccountRequestDto {
  @ApiProperty({
    description: '비밀번호 확인',
    example: 'password123!',
  })
  password: string;

  @ApiProperty({
    description: '삭제 사유',
    example: '더 이상 서비스를 사용하지 않음',
    required: false,
  })
  reason?: string;
}

export class DeleteAccountDataDto {
  @ApiProperty({
    description: '계정 삭제 예정일 (Unix timestamp)',
    example: 1704067200,
  })
  scheduledDeletionDate: number;
}

export class DeleteAccountResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '계정 삭제 요청이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '계정 삭제 데이터',
    type: DeleteAccountDataDto,
  })
  data: DeleteAccountDataDto;
}

export class UserSummaryDto {
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

export class GetAllUsersResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자 목록을 성공적으로 조회했습니다.',
  })
  message: string;

  @ApiProperty({
    description: '사용자 목록 데이터',
    type: [UserSummaryDto],
  })
  data: UserSummaryDto[];
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

export class UpdateUserDataDto {
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

export class UpdateUserResponseDto {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '사용자 정보가 성공적으로 업데이트되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '업데이트된 사용자 정보',
    type: UpdateUserDataDto,
  })
  data: UpdateUserDataDto;
}
