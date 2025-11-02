import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
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

// 버그 리포트 목록 조회 응답
export class GetBugReportsResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: [BugReportDataDto] })
  data: BugReportDataDto[];
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
