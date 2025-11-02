# 버그 리포트 API 문서

클라이언트(Next.js)에서 발생한 버그를 백엔드로 리포트하는 API입니다.

## 엔드포인트

### 1. 버그 리포트 생성 (POST)
- **URL**: `/bug-reports`
- **인증 필요**: ❌ (Public API)
- **설명**: 클라이언트에서 발생한 버그를 서버에 리포트합니다.

**요청 본문**:
```json
{
  "title": "TypeError in HomePage",
  "description": "홈페이지에서 버튼 클릭 시 오류 발생",
  "errorMessage": "Cannot read property 'map' of undefined",
  "errorStack": "Error: Cannot read property...",
  "errorType": "type_error",
  "errorCode": "ERR_UNDEFINED",
  "url": "https://example.com/home",
  "userAgent": "Mozilla/5.0...",
  "severity": "medium",
  "userId": "user123",
  "assigneeId": "admin123",
  "metadata": {
    "browser": "Chrome",
    "version": "120.0"
  }
}
```

**응답**:
```json
{
  "success": true,
  "message": "버그 리포트가 성공적으로 등록되었습니다.",
  "data": {
    "id": 1,
    "title": "TypeError in HomePage",
    "status": "open",
    "severity": "medium",
    "createdAt": "2025-11-02T12:00:00Z",
    ...
  }
}
```

### 2. 모든 버그 리포트 조회 (GET)
- **URL**: `/bug-reports`
- **인증 필요**: ✅ (Bearer Token)
- **설명**: 등록된 모든 버그 리포트를 조회합니다.

**쿼리 파라미터**:
- `userId` (optional): 특정 사용자의 버그 리포트만 조회

### 3. 특정 버그 리포트 조회 (GET)
- **URL**: `/bug-reports/:id`
- **인증 필요**: ✅ (Bearer Token)
- **설명**: ID로 특정 버그 리포트를 조회합니다.

### 4. 버그 리포트 업데이트 (PATCH)
- **URL**: `/bug-reports/:id`
- **인증 필요**: ✅ (Bearer Token)
- **설명**: 버그 리포트의 상태나 내용을 업데이트합니다.

**요청 본문**:
```json
{
  "status": "in_progress",
  "severity": "high",
  "assigneeId": "admin123"
}
```

### 5. 버그 리포트 삭제 (DELETE)
- **URL**: `/bug-reports/:id`
- **인증 필요**: ✅ (Bearer Token)
- **설명**: 버그 리포트를 삭제합니다.

## Next.js 클라이언트 구현 예제

### 1. 에러 바운더리 설정 (app/error.tsx)

```typescript
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 발생 시 자동으로 버그 리포트
    reportBugToBackend(error);
  }, [error]);

  return (
    <div>
      <h2>오류가 발생했습니다!</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}

// 에러 타입 자동 감지 함수
function detectErrorType(error: Error): string {
  const errorName = error.name.toLowerCase();
  
  if (errorName.includes('type')) return 'type_error';
  if (errorName.includes('reference')) return 'reference_error';
  if (errorName.includes('syntax')) return 'syntax_error';
  if (errorName.includes('network')) return 'network_error';
  
  return 'runtime_error';
}

async function reportBugToBackend(error: Error) {
  try {
    await fetch('http://localhost:3000/bug-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: error.name || 'Unknown Error',
        description: error.message || '에러 메시지가 없습니다.',
        errorMessage: error.message,
        errorStack: error.stack,
        errorType: detectErrorType(error),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'high',
        metadata: {
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
        },
      }),
    });
  } catch (reportError) {
    console.error('버그 리포트 전송 실패:', reportError);
  }
}
```

### 2. 전역 에러 핸들링 (app/global-error.tsx)

```typescript
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>전역 오류가 발생했습니다!</h2>
        <button onClick={() => reset()}>다시 시도</button>
      </body>
    </html>
  );
}
```

### 3. 커스텀 에러 리포팅 훅 (hooks/useErrorReporter.ts)

```typescript
import { useCallback } from 'react';

// 에러 타입 자동 감지
function detectErrorType(error: Error): string {
  const errorName = error.name.toLowerCase();
  
  if (errorName.includes('type')) return 'type_error';
  if (errorName.includes('reference')) return 'reference_error';
  if (errorName.includes('syntax')) return 'syntax_error';
  if (errorName.includes('network')) return 'network_error';
  
  return 'runtime_error';
}

// HTTP 에러 처리
function handleHttpError(statusCode: number): { errorType: string; errorCode: string } {
  if (statusCode >= 400 && statusCode < 500) {
    return {
      errorType: 'client_error',
      errorCode: String(statusCode),
    };
  } else if (statusCode >= 500) {
    return {
      errorType: 'server_error',
      errorCode: String(statusCode),
    };
  }
  return {
    errorType: 'unknown',
    errorCode: String(statusCode),
  };
}

export function useErrorReporter() {
  const reportError = useCallback(async (
    error: Error | { statusCode?: number; message: string },
    additionalInfo?: Record<string, any>
  ) => {
    try {
      let errorType = 'unknown';
      let errorCode: string | undefined;

      // HTTP 에러 처리
      if ('statusCode' in error && error.statusCode) {
        const httpError = handleHttpError(error.statusCode);
        errorType = httpError.errorType;
        errorCode = httpError.errorCode;
      } 
      // 일반 JavaScript 에러
      else if (error instanceof Error) {
        errorType = detectErrorType(error);
      }

      const response = await fetch('http://localhost:3000/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: error instanceof Error ? error.name : 'HTTP Error',
          description: error.message || '에러가 발생했습니다.',
          errorMessage: error.message,
          errorStack: error instanceof Error ? error.stack : undefined,
          errorType,
          errorCode,
          url: window.location.href,
          userAgent: navigator.userAgent,
          severity: errorCode?.startsWith('5') ? 'high' : 'medium',
          metadata: {
            ...additionalInfo,
            timestamp: new Date().toISOString(),
            pathname: window.location.pathname,
          },
        }),
      });

      if (!response.ok) {
        console.error('버그 리포트 전송 실패');
      }
    } catch (err) {
      console.error('버그 리포트 전송 중 오류:', err);
    }
  }, []);

  return { reportError };
}
```

### 4. 사용 예제

```typescript
'use client';

import { useErrorReporter } from '@/hooks/useErrorReporter';

export default function MyComponent() {
  const { reportError } = useErrorReporter();

  // 일반 에러 리포트
  const handleClick = async () => {
    try {
      // 위험한 작업
      throw new TypeError('테스트 타입 에러');
    } catch (error) {
      // 에러 리포트 (자동으로 type_error로 감지됨)
      await reportError(error as Error, {
        component: 'MyComponent',
        action: 'handleClick',
      });
    }
  };

  // API 호출 에러 리포트
  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        // HTTP 에러 리포트
        await reportError(
          { 
            statusCode: response.status, 
            message: `API 요청 실패: ${response.statusText}` 
          },
          {
            component: 'MyComponent',
            action: 'handleApiCall',
            endpoint: '/api/data',
          }
        );
      }
    } catch (error) {
      // 네트워크 에러 등
      await reportError(error as Error, {
        component: 'MyComponent',
        action: 'handleApiCall',
      });
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        일반 에러 발생
      </button>
      <button onClick={handleApiCall}>
        API 호출
      </button>
    </div>
  );
}
```

### 5. 전역 에러 리스너 설정 (app/layout.tsx)

```typescript
'use client';

import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 전역 에러 리스너
    const handleError = (event: ErrorEvent) => {
      fetch('http://localhost:3000/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: event.error?.name || 'Uncaught Error',
          description: event.message || '예상치 못한 에러가 발생했습니다.',
          errorMessage: event.message,
          errorStack: event.error?.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          severity: 'critical',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        }),
      }).catch(console.error);
    };

    // Promise rejection 리스너
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      fetch('http://localhost:3000/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Unhandled Promise Rejection',
          description: String(event.reason),
          errorMessage: String(event.reason),
          url: window.location.href,
          userAgent: navigator.userAgent,
          severity: 'high',
          metadata: {
            type: 'promise_rejection',
          },
        }),
      }).catch(console.error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

## 버그 리포트 상태 (Status)

- `open`: 새로 등록된 버그
- `in_progress`: 수정 중
- `resolved`: 해결됨
- `closed`: 종료됨

## 버그 심각도 (Severity)

- `low`: 낮음
- `medium`: 보통
- `high`: 높음
- `critical`: 치명적

## 에러 타입 (Error Type)

- `unknown`: 알 수 없음 (기본값)
- `client_error`: 클라이언트 에러 (4xx HTTP 상태 코드)
- `server_error`: 서버 에러 (5xx HTTP 상태 코드)
- `network_error`: 네트워크 에러
- `runtime_error`: 런타임 에러
- `validation_error`: 유효성 검증 에러
- `syntax_error`: 구문 에러
- `reference_error`: 참조 에러 (변수/함수를 찾을 수 없음)
- `type_error`: 타입 에러

## 주의사항

1. **민감한 정보 제외**: 에러 스택에 민감한 정보(API 키, 비밀번호 등)가 포함되지 않도록 주의하세요.
2. **요청 제한**: 무한 루프로 인한 버그 리포트 스팸을 방지하기 위해 디바운싱을 적용하세요.
3. **성능 고려**: 에러 리포팅이 앱 성능에 영향을 주지 않도록 비동기로 처리하세요.
4. **로컬 개발 환경**: 개발 환경에서는 에러 리포팅을 비활성화하거나 로컬 서버로 전송하도록 설정하세요.

## 환경 변수 설정

```env
NEXT_PUBLIC_BUG_REPORT_API_URL=http://localhost:3000/bug-reports
NEXT_PUBLIC_ENABLE_BUG_REPORTING=true
```

```typescript
// 환경 변수를 사용한 조건부 리포팅
const shouldReport = process.env.NEXT_PUBLIC_ENABLE_BUG_REPORTING === 'true' 
  && process.env.NODE_ENV === 'production';

if (shouldReport) {
  reportError(error);
}
```

