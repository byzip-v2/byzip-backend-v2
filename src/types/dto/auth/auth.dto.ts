/**
 * 인증 관련 DTO 정의
 */

export interface RegisterRequestDto {
  /** 사용자 ID (로그인용) */
  userId: string;
  /** 사용자 이름 */
  name: string;
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 비밀번호 확인 */
  confirmPassword: string;
  /** 전화번호 (선택) */
  phoneNumber?: string;
}
