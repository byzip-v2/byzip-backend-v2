// 버그 리포트 관련 타입 정의

export enum BugReportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum BugReportSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum BugReportErrorType {
  UNKNOWN = 'unknown',
  CLIENT_ERROR = 'client_error',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  RUNTIME_ERROR = 'runtime_error',
  VALIDATION_ERROR = 'validation_error',
  SYNTAX_ERROR = 'syntax_error',
  REFERENCE_ERROR = 'reference_error',
  TYPE_ERROR = 'type_error',
}

// 버그 리포트 생성 요청 DTO
export interface CreateBugReportDto {
  title: string;
  description: string;
  errorMessage?: string;
  errorStack?: string;
  errorType?: BugReportErrorType;
  errorCode?: string;
  url?: string;
  userAgent?: string;
  severity?: BugReportSeverity;
  userId?: string;
  assigneeId?: string;
  metadata?: Record<string, any>;
}

// 버그 리포트 업데이트 요청 DTO
export interface UpdateBugReportDto {
  title?: string;
  description?: string;
  status?: BugReportStatus;
  severity?: BugReportSeverity;
  errorMessage?: string;
  errorStack?: string;
  errorType?: BugReportErrorType;
  errorCode?: string;
  assigneeId?: string;
  metadata?: Record<string, any>;
}

// 버그 리포트 응답 데이터
export interface BugReportDataDto {
  id: number;
  title: string;
  description: string;
  errorMessage?: string;
  errorStack?: string;
  errorType: BugReportErrorType;
  errorCode?: string;
  url?: string;
  userAgent?: string;
  status: BugReportStatus;
  severity: BugReportSeverity;
  userId?: string;
  assigneeId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 단일 버그 리포트 조회 응답
export interface GetBugReportResponseDto {
  success: boolean;
  message: string;
  data: BugReportDataDto;
}

// 버그 리포트 목록 조회 응답
export interface GetBugReportsResponseDto {
  success: boolean;
  message: string;
  data: BugReportDataDto[];
}

// 버그 리포트 생성 응답
export interface CreateBugReportResponseDto {
  success: boolean;
  message: string;
  data: BugReportDataDto;
}

// 버그 리포트 업데이트 응답
export interface UpdateBugReportResponseDto {
  success: boolean;
  message: string;
  data: BugReportDataDto;
}

// 버그 리포트 삭제 응답
export interface DeleteBugReportResponseDto {
  success: boolean;
  message: string;
}
