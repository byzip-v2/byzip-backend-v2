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

## 🚀 사용법

### 기본 import

```typescript
import {
  // 인증 관련
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  TokenDataDto,

  // 사용자 관련
  GetMeResponseDto,
  UpdateUserRequestDto,
  UsersRolesEnum,
  UsersStatusEnum,

  // 공통 응답
  BaseResponseDto,
  createSuccessResponse,
  createErrorResponse,
} from 'byzip-v2-sdk';
```

### 사용 예제

#### 🔐 인증 관련

```typescript
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from 'byzip-v2-sdk';

// 로그인 요청
const loginRequest: LoginRequestDto = {
  userId: 'user123',
  password: 'password123!',
};

// 회원가입 요청
const registerRequest: RegisterRequestDto = {
  userId: 'newuser',
  name: '홍길동',
  email: 'user@example.com',
  password: 'password123!',
  confirmPassword: 'password123!',
  phoneNumber: '010-1234-5678', // 선택사항
};

// 로그인 응답 처리
const handleLoginResponse = (response: LoginResponseDto) => {
  if (response.success) {
    console.log('로그인 성공:', response.data.accessToken);
    console.log('메시지:', response.message);
  }
};
```

#### 👤 사용자 프로필 관련

```typescript
import {
  GetMeResponseDto,
  UpdateUserRequestDto,
  UsersGenderEnum,
  UsersRolesEnum,
} from 'byzip-v2-sdk';

// 프로필 조회 응답 처리
const handleProfileResponse = (response: GetMeResponseDto) => {
  const { data } = response;
  console.log('사용자 ID:', data.userId);
  console.log('이름:', data.name);
  console.log('역할:', data.role);
  console.log('상태:', data.status);
  console.log('이메일 인증:', data.emailVerified);
};

// 프로필 업데이트 요청
const updateRequest: UpdateUserRequestDto = {
  name: '홍길동',
  email: 'newemail@example.com',
  phoneNumber: '010-9876-5432',
  birthDate: '1990-01-01',
  gender: UsersGenderEnum.MALE,
  role: UsersRolesEnum.USER,
};
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

## 📚 타입 정의

### 🔐 인증 관련 (Auth)

| 타입                      | 설명             |
| ------------------------- | ---------------- |
| `LoginRequestDto`         | 로그인 요청      |
| `LoginResponseDto`        | 로그인 응답      |
| `RegisterRequestDto`      | 회원가입 요청    |
| `RegisterResponseDto`     | 회원가입 응답    |
| `TokenDataDto`            | 토큰 데이터      |
| `RefreshTokenRequestDto`  | 토큰 갱신 요청   |
| `RefreshTokenResponseDto` | 토큰 갱신 응답   |
| `LogoutResponseDto`       | 로그아웃 응답    |
| `DeleteUserRequestDto`    | 사용자 삭제 요청 |
| `DeleteUserResponseDto`   | 사용자 삭제 응답 |

### 👤 사용자 관련 (User)

| 타입                        | 설명                  |
| --------------------------- | --------------------- |
| `UsersModelDto`             | 사용자 모델           |
| `GetMeResponseDto`          | 내 정보 조회 응답     |
| `GetMeDataDto`              | 내 정보 데이터        |
| `UpdateUserRequestDto`      | 사용자 정보 수정 요청 |
| `UpdateUserResponseDto`     | 사용자 정보 수정 응답 |
| `GetAllUsersResponseDto`    | 모든 사용자 조회 응답 |
| `UserSummaryDto`            | 사용자 요약 정보      |
| `ChangePasswordRequestDto`  | 비밀번호 변경 요청    |
| `ChangePasswordResponseDto` | 비밀번호 변경 응답    |
| `DeleteAccountRequestDto`   | 계정 삭제 요청        |
| `DeleteAccountResponseDto`  | 계정 삭제 응답        |

### 📊 열거형 (Enums)

| 열거형            | 값                                                        |
| ----------------- | --------------------------------------------------------- |
| `UsersRolesEnum`  | `ADMIN`, `USER`                                           |
| `UsersStatusEnum` | `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION` |
| `UsersGenderEnum` | `MALE`, `FEMALE`, `OTHER`                                 |

### 📦 공통 (Common)

| 타입                         | 설명                |
| ---------------------------- | ------------------- |
| `BaseResponseDto<T>`         | 기본 API 응답 구조  |
| `createSuccessResponse<T>()` | 성공 응답 생성 함수 |
| `createErrorResponse<T>()`   | 에러 응답 생성 함수 |

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

### v1.0.2

- ✅ 모든 DTO 클래스를 인터페이스로 변환
- ✅ 런타임 의존성 제거 (`@nestjs/swagger` 제거)
- ✅ 타입 안전성 향상
- ✅ 번들 크기 최적화
- ✅ GitHub Actions 자동 배포 시스템 구축
