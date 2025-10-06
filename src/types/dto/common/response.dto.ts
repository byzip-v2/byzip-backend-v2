/**
 * 공통 API 응답 구조 DTO
 */

import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({
    description: '요청 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
  })
  data: T;

  constructor(success: boolean, message: string, data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(
    data: T,
    message: string = '요청이 성공적으로 처리되었습니다.',
  ): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, data);
  }

  static error<T = null>(
    message: string,
    data: T = null as T,
  ): BaseResponseDto<T> {
    return new BaseResponseDto(false, message, data);
  }
}
