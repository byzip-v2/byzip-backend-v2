/**
 * API 응답 생성 헬퍼 함수
 */

import { BaseResponseDto } from './response.dto';

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = '요청이 성공적으로 처리되었습니다.'
): BaseResponseDto<T> {
  return {
    success: true,
    message,
    data
  };
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse<T = null>(
  message: string,
  data: T = null as T
): BaseResponseDto<T> {
  return {
    success: false,
    message,
    data
  };
}
