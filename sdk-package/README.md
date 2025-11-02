# ByZip V2 SDK

분양모음집 V2 프로젝트의 프론트엔드와 백엔드 간 타입 통일을 위한 TypeScript SDK입니다.

## ✨ 특징

- 🚀 **런타임 의존성 없음** - 순수 TypeScript 타입 정의만 제공
- 📦 **가벼운 번들** - 추가 패키지 설치 불필요
- 🔒 **타입 안전성** - 완전한 TypeScript 타입 체크 지원
- 🌐 **범용 호환성** - 모든 JavaScript/TypeScript 환경에서 사용 가능
- 🤖 **자동 업데이트** - 백엔드 타입 변경 시 자동으로 배포

## 📦 설치

```bash
npm install byzip-v2-sdk
```

#### 📝 공통 응답 처리

```typescript
import {
  BaseResponseDto,
  createSuccessResponse,
  createErrorResponse,
} from 'byzip-v2-sdk';

// 성공 응답 생성
const successResponse = createSuccessResponse(
  { message: '처리 완료' },
  '요청이 성공적으로 처리되었습니다.',
);

// 에러 응답 생성
const errorResponse = createErrorResponse('처리 중 오류가 발생했습니다.');

// 응답 타입 처리
const handleResponse = <T>(response: BaseResponseDto<T>) => {
  if (response.success) {
    console.log('성공:', response.data);
  } else {
    console.error('실패:', response.message);
  }
};
```

## 🤖 자동 배포

이 패키지는 백엔드 저장소의 타입 파일(`src/types/`)이 변경될 때마다 GitHub Actions를 통해 자동으로 업데이트되어 NPM에 배포됩니다.

### 배포 프로세스

1. 백엔드 코드의 DTO 타입 변경
2. `main` 또는 `dev` 브랜치에 푸시
3. GitHub Actions 자동 실행
4. 타입 추출 및 변환 (클래스 → 인터페이스)
5. 버전 자동 증가
6. NPM에 자동 배포

## 🛠️ 개발

### 로컬에서 타입 추출

```bash
npm run sdk:extract
```

### 빌드

```bash
npm run sdk:build
```

### 수동 배포

```bash
npm run sdk:publish
```

## 📄 라이선스

ISC

---

## 🔄 변경 로그

- ✅ 모든 DTO 클래스를 인터페이스로 변환
- ✅ 런타임 의존성 제거 (`@nestjs/swagger` 제거)
- ✅ 타입 안전성 향상
- ✅ 번들 크기 최적화
- ✅ GitHub Actions 자동 배포 시스템 구축
