/**
 * 공통 API 응답 구조 DTO
 */

export interface BaseResponseDto<T = any> {
  success: boolean;
  message: string;
  data: T;
}
