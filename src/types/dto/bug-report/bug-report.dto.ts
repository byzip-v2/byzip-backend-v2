import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  BugReportErrorType,
  BugReportSeverity,
  BugReportStatus,
} from '../../../bug-reports/entities/bug-report.entity';

// 버그 리포트 생성 요청 DTO
export class CreateBugReportDto {
  @ApiProperty({ description: '버그 제목', example: 'TypeError in HomePage' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '버그 상세 설명',
    example: '홈페이지에서 버튼 클릭 시 오류 발생',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: '에러 메시지',
    example: "Cannot read property 'map' of undefined",
  })
  @IsString()
  @IsOptional()
  errorMessage?: string;

  @ApiPropertyOptional({
    description: '에러 스택 트레이스',
    example: 'Error: Cannot read property...\n    at HomePage.render...',
  })
  @IsString()
  @IsOptional()
  errorStack?: string;

  @ApiPropertyOptional({
    description: '에러 타입',
    enum: BugReportErrorType,
    example: BugReportErrorType.TYPE_ERROR,
  })
  @IsEnum(BugReportErrorType)
  @IsOptional()
  errorType?: BugReportErrorType;

  @ApiPropertyOptional({
    description: '에러 코드 (HTTP 상태 코드 등)',
    example: '401',
  })
  @IsString()
  @IsOptional()
  errorCode?: string;

  @ApiPropertyOptional({
    description: '버그 발생 URL',
    example: 'https://example.com/home',
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: '사용자 브라우저 정보',
    example: 'Mozilla/5.0...',
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({
    description: '버그 심각도',
    enum: BugReportSeverity,
    example: BugReportSeverity.MEDIUM,
  })
  @IsEnum(BugReportSeverity)
  @IsOptional()
  severity?: BugReportSeverity;

  @ApiPropertyOptional({
    description: '사용자 ID (로그인 한 경우)',
    example: 'user123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: '담당자 ID',
    example: 'admin123',
  })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    description: '추가 메타데이터',
    example: { browser: 'Chrome', version: '120.0' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: '메모',
    example: '관리자 메모 또는 추가 정보',
  })
  @IsString()
  @IsOptional()
  memo?: string;
}

// 버그 리포트 업데이트 요청 DTO
export class UpdateBugReportDto {
  @ApiPropertyOptional({ description: '버그 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '버그 상세 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '버그 상태',
    enum: BugReportStatus,
    example: BugReportStatus.IN_PROGRESS,
  })
  @IsEnum(BugReportStatus)
  @IsOptional()
  status?: BugReportStatus;

  @ApiPropertyOptional({
    description: '버그 심각도',
    enum: BugReportSeverity,
  })
  @IsEnum(BugReportSeverity)
  @IsOptional()
  severity?: BugReportSeverity;

  @ApiPropertyOptional({ description: '에러 메시지' })
  @IsString()
  @IsOptional()
  errorMessage?: string;

  @ApiPropertyOptional({ description: '에러 스택 트레이스' })
  @IsString()
  @IsOptional()
  errorStack?: string;

  @ApiPropertyOptional({ description: '에러 타입', enum: BugReportErrorType })
  @IsEnum(BugReportErrorType)
  @IsOptional()
  errorType?: BugReportErrorType;

  @ApiPropertyOptional({ description: '에러 코드' })
  @IsString()
  @IsOptional()
  errorCode?: string;

  @ApiPropertyOptional({ description: '담당자 ID' })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({ description: '추가 메타데이터' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: '메모' })
  @IsString()
  @IsOptional()
  memo?: string;
}

// 버그 리포트 응답 데이터
export class BugReportDataDto {
  @ApiProperty({ description: '버그 리포트 ID' })
  id: number;

  @ApiProperty({ description: '버그 제목' })
  title: string;

  @ApiProperty({ description: '버그 상세 설명' })
  description: string;

  @ApiPropertyOptional({ description: '에러 메시지' })
  errorMessage?: string;

  @ApiPropertyOptional({ description: '에러 스택 트레이스' })
  errorStack?: string;

  @ApiProperty({ description: '에러 타입', enum: BugReportErrorType })
  errorType: BugReportErrorType;

  @ApiPropertyOptional({ description: '에러 코드 (HTTP 상태 코드 등)' })
  errorCode?: string;

  @ApiPropertyOptional({ description: '버그 발생 URL' })
  url?: string;

  @ApiPropertyOptional({ description: '사용자 브라우저 정보' })
  userAgent?: string;

  @ApiProperty({ description: '버그 상태', enum: BugReportStatus })
  status: BugReportStatus;

  @ApiProperty({ description: '버그 심각도', enum: BugReportSeverity })
  severity: BugReportSeverity;

  @ApiPropertyOptional({ description: '사용자 ID' })
  userId?: string;

  @ApiPropertyOptional({ description: '담당자 ID' })
  assigneeId?: string;

  @ApiPropertyOptional({ description: '추가 메타데이터' })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: '메모' })
  memo?: string;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;
}

// 단일 버그 리포트 조회 응답
export class GetBugReportResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: BugReportDataDto })
  data: BugReportDataDto;
}

// 버그 리포트 목록 조회 쿼리 DTO
export class GetBugReportsQueryDto {
  @ApiPropertyOptional({
    description: '검색어 (제목, 설명, 에러 메시지에서 검색)',
    example: 'TypeError',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: '상태 필터',
    enum: BugReportStatus,
    example: BugReportStatus.OPEN,
  })
  @IsEnum(BugReportStatus)
  @IsOptional()
  status?: BugReportStatus;

  @ApiPropertyOptional({
    description: '심각도 필터',
    enum: BugReportSeverity,
    example: BugReportSeverity.HIGH,
  })
  @IsEnum(BugReportSeverity)
  @IsOptional()
  severity?: BugReportSeverity;

  @ApiPropertyOptional({
    description: '에러 타입 필터',
    enum: BugReportErrorType,
    example: BugReportErrorType.TYPE_ERROR,
  })
  @IsEnum(BugReportErrorType)
  @IsOptional()
  errorType?: BugReportErrorType;

  @ApiPropertyOptional({
    description: '사용자 ID 필터',
    example: 'user123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: '담당자 ID 필터',
    example: 'admin123',
  })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    description: '페이지 번호 (1부터 시작)',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: '페이지당 항목 수 (최대 100)',
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: '정렬 기준 필드',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: '정렬 순서 (ASC 또는 DESC)',
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

// 페이징 메타데이터
export class PaginationMetaDto {
  @ApiProperty({ description: '현재 페이지', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 10 })
  limit: number;

  @ApiProperty({ description: '전체 항목 수', example: 100 })
  total: number;

  @ApiProperty({ description: '전체 페이지 수', example: 10 })
  totalPages: number;

  @ApiProperty({ description: '현재 페이지 항목 수', example: 10 })
  itemCount: number;
}

// 버그 리포트 목록 조회 응답
export class GetBugReportsResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: [BugReportDataDto] })
  data: BugReportDataDto[];

  @ApiProperty({ type: PaginationMetaDto, description: '페이징 정보' })
  meta: PaginationMetaDto;
}

// 버그 리포트 생성 응답
export class CreateBugReportResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: BugReportDataDto })
  data: BugReportDataDto;
}

// 버그 리포트 업데이트 응답
export class UpdateBugReportResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: BugReportDataDto })
  data: BugReportDataDto;
}

// 버그 리포트 삭제 응답
export class DeleteBugReportResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;
}
