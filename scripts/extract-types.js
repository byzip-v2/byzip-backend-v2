#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SDK_DIR = 'sdk-package/src';

// SDK 디렉토리 생성
if (!fs.existsSync(SDK_DIR)) {
  fs.mkdirSync(SDK_DIR, { recursive: true });
}

console.log('🔍 DTO 및 타입 파일 추출 중...');

/**
 * 파일에서 @nestjs/swagger 관련 내용 제거하고 클래스를 인터페이스로 변환
 */
function processFile(inputPath, outputPath) {
  console.log(`  📄 처리 중: ${inputPath} -> ${outputPath}`);

  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n');
  const output = [];
  let inDecorator = false;
  let inMethod = false;
  let inImport = false;
  let importLines = [];
  let bracketCount = 0;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // import 시작 감지
    if (trimmedLine.startsWith('import')) {
      importLines = [line];
      
      // 멀티라인 import인지 확인 (중괄호가 열려있고 닫히지 않음)
      if (trimmedLine.includes('{') && !trimmedLine.includes('}')) {
        inImport = true;
      } else {
        // 단일 라인 import - 바로 확인
        const shouldSkip =
          trimmedLine.includes('@nestjs/swagger') ||
          trimmedLine.includes('class-validator') ||
          trimmedLine.includes('class-transformer');
        
        if (shouldSkip) {
          continue;
        }
        importLines = [];
      }
      continue;
    }

    // 멀티라인 import 처리
    if (inImport) {
      importLines.push(line);
      
      // import 블록이 끝나는지 확인 (} from '...' 형태)
      if (trimmedLine.includes('}') && trimmedLine.includes('from')) {
        inImport = false;
        
        // 전체 import 블록을 합쳐서 확인
        const fullImport = importLines.join(' ');
        const shouldSkip =
          fullImport.includes('@nestjs/swagger') ||
          fullImport.includes('class-validator') ||
          fullImport.includes('class-transformer');
        
        if (shouldSkip) {
          importLines = [];
          continue;
        }
        importLines = [];
      } else {
        continue;
      }
    }

    // entity import 건너뛰기
    if (
      trimmedLine.startsWith('import') &&
      trimmedLine.includes('/entities/')
    ) {
      continue;
    }

    // @ApiProperty, @IsString, @IsOptional 등 모든 데코레이터 건너뛰기
    if (trimmedLine.startsWith('@')) {
      inDecorator = true;
      bracketCount = 0;

      // 괄호 카운트
      for (let char of line) {
        if (char === '(') bracketCount++;
        if (char === ')') bracketCount--;
      }

      // 같은 줄에서 데코레이터가 끝나면
      if (bracketCount === 0) {
        inDecorator = false;
      }
      continue;
    }

    // 데코레이터 내부인 경우 괄호 카운팅
    if (inDecorator) {
      for (let char of line) {
        if (char === '(') bracketCount++;
        if (char === ')') bracketCount--;
      }

      // 모든 괄호가 닫히면 데코레이터 끝
      if (bracketCount === 0) {
        inDecorator = false;
      }
      continue;
    }

    // constructor 또는 static 메서드, 일반 메서드 감지
    if (
      !inMethod &&
      (trimmedLine.startsWith('constructor(') ||
        trimmedLine.startsWith('static ') ||
        (trimmedLine.includes('(') &&
          trimmedLine.includes(')') &&
          (trimmedLine.includes('{') ||
            (i + 1 < lines.length && lines[i + 1].trim().startsWith('{')))))
    ) {
      // 메서드 시작인지 속성인지 확인 (속성은 세미콜론으로 끝남)
      if (!trimmedLine.endsWith(';') && !trimmedLine.includes(': ')) {
        inMethod = true;
        braceCount = 0;

        // 중괄호 카운팅
        for (let char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }

        // 같은 줄에서 메서드가 끝나면
        if (braceCount === 0 && trimmedLine.includes('}')) {
          inMethod = false;
        }
        continue;
      }
    }

    // 메서드 내부인 경우
    if (inMethod) {
      for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }

      // 모든 중괄호가 닫히면 메서드 끝
      if (braceCount === 0) {
        inMethod = false;
      }
      continue;
    }

    // export class를 export interface로 변환
    let processedLine = line;
    if (
      trimmedLine.startsWith('export class ') &&
      !trimmedLine.includes(' extends ')
    ) {
      processedLine = line.replace(/export class /g, 'export interface ');
    }

    output.push(processedLine);
  }

  // 출력 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
}

/**
 * 파일 복사 (변환 불필요)
 */
function copyFile(inputPath, outputPath) {
  console.log(`  📄 복사 중: ${inputPath} -> ${outputPath}`);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.copyFileSync(inputPath, outputPath);
}

/**
 * 디렉토리에서 재귀적으로 .dto.ts 파일 찾기
 */
function findDtoFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findDtoFiles(filePath, fileList);
    } else if (file.endsWith('.dto.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 1. DTO 파일 자동 검색 및 처리
const dtoDir = 'src/types/dto';
if (fs.existsSync(dtoDir)) {
  const dtoFiles = findDtoFiles(dtoDir);

  dtoFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const outputPath = path.join(SDK_DIR, fileName);
    processFile(filePath, outputPath);
  });
}

// 2. 기타 타입 파일 처리
const additionalFiles = [
  {
    input: 'src/types/jwt.types.ts',
    output: path.join(SDK_DIR, 'jwt.types.ts'),
    process: false,
  },
];

additionalFiles.forEach((file) => {
  if (fs.existsSync(file.input)) {
    if (file.process) {
      processFile(file.input, file.output);
    } else {
      copyFile(file.input, file.output);
    }
  } else {
    console.log(`  ⚠️  파일을 찾을 수 없습니다: ${file.input}`);
  }
});

// response.dto.ts는 수동으로 생성 (클래스 구조가 복잡해서)
const responseDtoContent = `/**
 * 공통 API 응답 구조 DTO
 */

export interface BaseResponseDto<T = any> {
  success: boolean;
  message: string;
  data: T;
}
`;

fs.writeFileSync(
  path.join(SDK_DIR, 'response.dto.ts'),
  responseDtoContent,
  'utf-8',
);
console.log(`  📄 생성: response.dto.ts (수동 생성)`);

// Constants 파일 (선택적)
const constFile = 'src/types/const/auth.const.ts';
if (fs.existsSync(constFile)) {
  copyFile(constFile, path.join(SDK_DIR, 'auth.const.ts'));
}

// response.helpers.ts 생성 (헬퍼 함수)
const helpersContent = `/**
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
`;

fs.writeFileSync(
  path.join(SDK_DIR, 'response.helpers.ts'),
  helpersContent,
  'utf-8',
);

// index.ts 자동 생성
const generatedFiles = fs
  .readdirSync(SDK_DIR)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
  .map((file) => file.replace('.ts', ''));

const indexContent = `/**
 * ByZip V2 SDK
 * 자동 생성된 파일입니다. 수정하지 마세요.
 */

${generatedFiles.map((file) => `export * from './${file}';`).join('\n')}
`;

fs.writeFileSync(path.join(SDK_DIR, 'index.ts'), indexContent, 'utf-8');
console.log(`  📄 생성: index.ts (${generatedFiles.length}개 파일 export)`);

// bug-report.dto.ts 특별 처리 (class-validator 의존성 제거)
const bugReportDtoPath = path.join(SDK_DIR, 'bug-report.dto.ts');
if (fs.existsSync(bugReportDtoPath)) {
  console.log('  🔧 bug-report.dto.ts 후처리 중...');

  const bugReportContent = `// 버그 리포트 관련 타입 정의

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
  memo?: string;
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
  memo?: string;
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
  memo?: string;
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
`;

  fs.writeFileSync(bugReportDtoPath, bugReportContent, 'utf-8');
  console.log('  ✅ bug-report.dto.ts 후처리 완료');
}

console.log('✅ 타입 추출 완료!');
console.log(`📦 SDK 패키지 위치: ${SDK_DIR}`);
