/**
 * 사용자 프로필 관련 DTO 정의
 */


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
export interface GetMeDataDto {
  id: number;

  userId: string;

  name: string;

  email: string;

  phoneNumber?: string;

  profileImageUrl?: string;

  birthDate?: string;

  gender?: UsersGenderEnum;

  createdAt: string;

  updatedAt: string;

  status: UsersStatusEnum;

  role: UsersRolesEnum;

  emailVerified: boolean;

  phoneVerified: boolean;
}

export interface GetMeResponseDto {
  success: boolean;

  message: string;

  data: GetMeDataDto;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}

export interface ChangePasswordDataDto {
  tokenRefreshRequired: boolean;
}

export interface ChangePasswordResponseDto {
  success: boolean;

  message: string;

  data: ChangePasswordDataDto;
}
export interface DeleteAccountRequestDto {
  password: string;

  reason?: string;
}

export interface DeleteAccountDataDto {
  scheduledDeletionDate: number;
}

export interface DeleteAccountResponseDto {
  success: boolean;

  message: string;

  data: DeleteAccountDataDto;
}

export interface UserSummaryDto {
  id: number;

  userId: string;

  name: string;

  email: string;

  phoneNumber?: string;

  profileImageUrl?: string;

  createdAt: string;

  status: UsersStatusEnum;

  role: UsersRolesEnum;

  emailVerified: boolean;
}

export interface GetAllUsersResponseDto {
  success: boolean;

  message: string;

  data: UserSummaryDto[];
}

export interface UpdateUserRequestDto {
  name?: string;

  email?: string;

  phoneNumber?: string;

  role?: UsersRolesEnum;

  birthDate?: string;

  gender?: UsersGenderEnum;
}

export interface UpdateUserDataDto {
  id: number;

  userId: string;

  name: string;

  email: string;

  phoneNumber?: string;

  profileImageUrl?: string;

  birthDate?: string;

  gender?: UsersGenderEnum;

  createdAt: string;

  updatedAt: string;

  status: UsersStatusEnum;

  role: UsersRolesEnum;

  emailVerified: boolean;

  phoneVerified: boolean;
}

export interface UpdateUserResponseDto {
  success: boolean;

  message: string;

  data: UpdateUserDataDto;
}
