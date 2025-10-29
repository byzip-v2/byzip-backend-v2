# 🤖 SDK 자동 배포 시스템

백엔드 DTO 타입이 변경될 때마다 자동으로 NPM SDK 패키지를 배포하는 시스템입니다.

1. DTO 파일 수정 (src/types/)
   ↓
2. Git Push (main/dev 브랜치)
   ↓
3. GitHub Actions 자동 실행
   ↓
4. 타입 추출 (class → interface, 데코레이터 제거)
   ↓
5. SDK 빌드 (TypeScript → JavaScript + .d.ts)
   ↓
6. 버전 자동 증가 (1.0.2 → 1.0.3)
   ↓
7. NPM 자동 배포
   ↓
8. ✅ 프론트엔드에서 즉시 사용 가능!

## 📂 프로젝트 구조

```
byzip-be/
├── .github/
│   └── workflows/
│       ├── publish-sdk.yml          # GitHub Actions 워크플로우
│       └── WORKFLOW_SUMMARY.md      # 워크플로우 상세 설명
│
├── scripts/
│   └── extract-types.js             # 타입 추출 스크립트
│
├── sdk-package/                     # SDK 패키지 디렉토리
│   ├── package.json                 # SDK 패키지 설정
│   ├── tsconfig.json                # TypeScript 설정
│   ├── README.md                    # SDK 사용 가이드
│   ├── src/                         # 생성된 타입 파일들
│   │   ├── index.ts
│   │   ├── auth.dto.ts
│   │   ├── user.dto.ts
│   │   ├── response.dto.ts
│   │   ├── response.helpers.ts
│   │   └── jwt.types.ts
│   └── dist/                        # 빌드 결과물
│
├── src/
│   └── types/
│       ├── dto/
│       │   ├── auth/
│       │   │   └── auth.dto.ts      # 원본 Auth DTO
│       │   ├── user/
│       │   │   └── user.dto.ts      # 원본 User DTO
│       │   └── common/
│       │       └── response.dto.ts  # 원본 Response DTO
│       ├── jwt.types.ts             # JWT 타입
│       └── const/
│           └── auth.const.ts        # 상수
│
├── SDK_SETUP.md                     # 초기 설정 가이드
├── GITHUB_ACTIONS_GUIDE.md          # GitHub Actions 상세 가이드
└── README_SDK_AUTOMATION.md         # 이 파일
```

## 🎯 시스템 개요

### 1. 자동 트리거

```
DTO 파일 수정 → Git Push → GitHub Actions 실행 → NPM 배포
```

### 2. 변환 프로세스

```typescript
// 백엔드 코드 (NestJS + Swagger)
export class LoginRequestDto {
  @ApiProperty({ description: '사용자 ID' })
  userId: string;
}

// ↓ 자동 변환 ↓

// SDK 코드 (순수 TypeScript)
export interface LoginRequestDto {
  userId: string;
}
```

### 3. 배포 결과

- **패키지 이름**: `byzip-v2-sdk`
- **버전 관리**: 자동 패치 버전 증가 (`1.0.2` → `1.0.3`)
- **배포 위치**: https://www.npmjs.com/package/byzip-v2-sdk

## 🚀 빠른 시작

### 1단계: NPM 토큰 설정

```bash
# NPM 로그인
npm login

# Access Token 생성
# → npmjs.com → Account Settings → Access Tokens
# → Generate New Token → Automation
```

### 2단계: GitHub Secrets 설정

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `NPM_TOKEN`, Value: (생성한 토큰)

### 3단계: 테스트

```bash
# 로컬에서 SDK 빌드 테스트
npm run sdk:build

# DTO 파일 수정 후 푸시
git add src/types/dto/auth/auth.dto.ts
git commit -m "feat: Update LoginRequestDto"
git push origin main

# GitHub Actions에서 배포 확인
# → 저장소 페이지 → Actions 탭
```

## 📋 주요 명령어

```bash
# SDK 타입 추출만
npm run sdk:extract

# SDK 빌드 (추출 + 의존성 설치 + 빌드)
npm run sdk:build

# SDK 배포 (빌드 + 배포)
npm run sdk:publish
```

## 🔄 워크플로우 상세

### 자동 배포 조건

- **브랜치**: `main` 또는 `dev`
- **변경 경로**: `src/types/**`

### 실행 단계

1. ✅ 코드 체크아웃
2. ✅ Node.js 20 설치
3. ✅ 타입 추출 (`scripts/extract-types.js`)
4. ✅ SDK 패키지 의존성 설치
5. ✅ TypeScript 빌드
6. ✅ 버전 자동 증가
7. ✅ NPM 배포
8. ✅ 완료 알림

### 예상 실행 시간

- **평균**: 2-3분
- **최대**: 5분

## 📦 배포되는 파일

### SDK 패키지 내용

```
byzip-v2-sdk/
├── dist/
│   ├── index.js
│   ├── index.d.ts
│   ├── auth.dto.js
│   ├── auth.dto.d.ts
│   ├── user.dto.js
│   ├── user.dto.d.ts
│   ├── response.dto.js
│   ├── response.dto.d.ts
│   ├── response.helpers.js
│   ├── response.helpers.d.ts
│   ├── jwt.types.js
│   └── jwt.types.d.ts
└── package.json
```

### 포함되는 타입

- ✅ Auth DTOs (로그인, 회원가입, 로그아웃, 토큰 갱신)
- ✅ User DTOs (프로필 조회/수정, 계정 삭제, 비밀번호 변경)
- ✅ Common DTOs (BaseResponseDto)
- ✅ Response Helpers (createSuccessResponse, createErrorResponse)
- ✅ Enums (UsersRolesEnum, UsersStatusEnum, UsersGenderEnum)
- ✅ JWT Types (JwtPayload)

## 🔧 로컬 개발

### SDK 수동 빌드

```bash
# 1. 타입 추출
node scripts/extract-types.js

# 2. SDK 디렉토리로 이동
cd sdk-package

# 3. 의존성 설치
npm install

# 4. 빌드
npm run build

# 5. 결과 확인
ls -la dist/
```

### SDK 로컬 테스트

```bash
# SDK 패키지를 로컬 패키지로 링크
cd sdk-package
npm link

# 프론트엔드 프로젝트에서 사용
cd ../your-frontend-project
npm link byzip-v2-sdk

# TypeScript로 import 테스트
import { LoginRequestDto } from 'byzip-v2-sdk';
```

## 📚 문서

### 설정 가이드

- **SDK_SETUP.md**: 초기 설정 방법 (NPM 토큰, GitHub Secrets)
- **GITHUB_ACTIONS_GUIDE.md**: GitHub Actions 상세 설명
- **.github/workflows/WORKFLOW_SUMMARY.md**: 워크플로우 단계별 설명

### SDK 사용 가이드

- **sdk-package/README.md**: SDK 설치 및 사용 방법

## ⚠️ 주의사항

### 1. 버전 관리

- 자동 배포는 **패치 버전**만 증가 (`1.0.2` → `1.0.3`)
- 마이너/메이저 버전 변경은 **수동**으로 조정 필요
- `sdk-package/package.json`에서 버전 수정 후 푸시

### 2. 브랜치 전략

- `main`: 프로덕션 배포
- `dev`: 개발 버전 배포 (권장)
- 실험적 변경은 별도 브랜치에서 테스트 후 병합

### 3. DTO 작성 규칙

```typescript
// ✅ 권장: 순수 타입 정의
export class LoginRequestDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  password: string;
}

// ❌ 비권장: 메서드 포함 (SDK에서 제거됨)
export class LoginRequestDto {
  userId: string;

  validate() {
    // 이 메서드는 SDK에 포함되지 않음
    return this.userId.length > 0;
  }
}
```

### 4. Breaking Changes

타입 구조를 변경할 때는 주의:

```typescript
// Breaking Change: 속성 이름 변경
userId → username  // ⚠️ 프론트엔드에서 에러 발생

// Safe Change: 선택적 속성 추가
phoneNumber?: string  // ✅ 안전
```

## 🐛 문제 해결

### 배포 실패

#### 1. "You must be logged in"

```bash
# NPM_TOKEN 확인
# GitHub Secrets → NPM_TOKEN 재설정
```

#### 2. "Version already exists"

```bash
# package.json 버전 확인
cd sdk-package
npm version patch
git add package.json
git commit -m "chore: bump version"
git push
```

#### 3. "Build failed"

```bash
# 로컬에서 빌드 테스트
npm run sdk:build

# 오류 확인 후 수정
```

### GitHub Actions 실패

```bash
# 1. Actions 탭에서 로그 확인
# 2. 실패한 단계 확인
# 3. 로컬에서 재현

# 수동 실행으로 재시도
# → Actions → Publish SDK to NPM → Run workflow
```

## 📊 모니터링

### 배포 성공 확인

```bash
# NPM에서 최신 버전 확인
npm view byzip-v2-sdk version

# 모든 버전 목록
npm view byzip-v2-sdk versions

# 패키지 정보
npm info byzip-v2-sdk
```

### GitHub Actions 대시보드

- 저장소 → **Actions** 탭
- 최근 워크플로우 실행 상태 확인
- 성공/실패 통계 확인

## 🎓 추가 정보

### TypeScript 설정

- **Target**: ES2020
- **Module**: CommonJS
- **Declaration**: true (타입 정의 파일 생성)

### NPM 패키지 설정

- **Main**: dist/index.js
- **Types**: dist/index.d.ts
- **Files**: dist/ (빌드 결과물만 배포)

### 런타임 의존성

- **없음** - 순수 타입 정의만 제공
- **DevDependencies**: typescript (빌드 용도)

## 🤝 기여 가이드

### DTO 추가/수정

```typescript
// 1. 백엔드에서 DTO 작성
// src/types/dto/payment/payment.dto.ts
export class PaymentRequestDto {
  @ApiProperty()
  amount: number;
}

// 2. scripts/extract-types.js 수정
const files = [
  // 기존 파일들...
  {
    input: 'src/types/dto/payment/payment.dto.ts',
    output: path.join(SDK_DIR, 'payment.dto.ts'),
    process: true
  }
];

// 3. sdk-package/src/index.ts에 export 추가
export * from './payment.dto';

// 4. 테스트 및 푸시
npm run sdk:build
git add .
git commit -m "feat: Add PaymentRequestDto"
git push origin main
```

## 📞 문의 및 지원

- **GitHub Issues**: 버그 리포트 및 기능 요청
- **GitHub Discussions**: 일반 질문 및 토론
- **문서**: 이 README 및 관련 가이드 문서

---

**Last Updated**: 2025-01-29
**Version**: 1.0.0
**Maintainer**: ByZip Team
