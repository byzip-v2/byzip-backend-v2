# SDK 자동 배포 설정 가이드

DTO 타입이 변경될 때마다 자동으로 NPM에 SDK를 배포하는 시스템입니다.

## 📋 목차

1. [NPM 토큰 설정](#npm-토큰-설정)
2. [GitHub Secrets 설정](#github-secrets-설정)
3. [동작 방식](#동작-방식)
4. [수동 배포](#수동-배포)
5. [문제 해결](#문제-해결)

## 🔑 NPM 토큰 설정

### 1. NPM 계정 생성 (없는 경우)

```bash
npm adduser
```

### 2. NPM Access Token 생성

1. [npmjs.com](https://www.npmjs.com) 로그인
2. 우측 상단 프로필 → **Access Tokens** 클릭
3. **Generate New Token** → **Classic Token** 선택
4. Token type: **Automation** 선택
5. 생성된 토큰 복사 (한 번만 표시됩니다!)

## 🔒 GitHub Secrets 설정

### 1. GitHub 저장소 설정 페이지로 이동

- 저장소 페이지 → **Settings** 탭

### 2. Secrets 추가

1. 좌측 메뉴에서 **Secrets and variables** → **Actions** 선택
2. **New repository secret** 클릭
3. 다음 정보 입력:
   - Name: `NPM_TOKEN`
   - Secret: (위에서 복사한 NPM 토큰 붙여넣기)
4. **Add secret** 클릭

## ⚙️ 동작 방식

### 자동 배포 트리거

다음 조건에서 자동으로 SDK가 NPM에 배포됩니다:

```yaml
# main 또는 dev 브랜치에 푸시할 때
# src/types/ 디렉토리의 파일이 변경된 경우
```

### 배포 프로세스

1. **타입 추출**: DTO 파일에서 `@ApiProperty` 데코레이터 제거
2. **버전 자동 증가**: 패치 버전 자동 업데이트 (0.0.1 → 0.0.2)
3. **빌드**: TypeScript 컴파일
4. **배포**: NPM에 자동 배포

### 배포되는 파일

```
src/types/dto/auth/auth.dto.ts → sdk-package/src/auth.dto.ts
src/types/dto/user/user.dto.ts → sdk-package/src/user.dto.ts
src/types/dto/common/response.dto.ts → sdk-package/src/response.dto.ts
src/types/jwt.types.ts → sdk-package/src/jwt.types.ts
src/types/const/auth.const.ts → sdk-package/src/auth.const.ts
```

## 🖥️ 수동 배포

필요한 경우 로컬에서 수동으로 배포할 수 있습니다:

```bash
# 1. 타입 추출
chmod +x scripts/extract-types.sh
bash scripts/extract-types.sh

# 2. SDK 패키지 디렉토리로 이동
cd sdk-package

# 3. 의존성 설치
npm install

# 4. 빌드
npm run build

# 5. 버전 업데이트 (선택)
npm version patch  # 0.0.1 → 0.0.2
npm version minor  # 0.0.1 → 0.1.0
npm version major  # 0.0.1 → 1.0.0

# 6. NPM에 배포
npm publish
```

## 🔍 배포 확인

### GitHub Actions 로그 확인

1. 저장소의 **Actions** 탭 클릭
2. **Publish SDK to NPM** 워크플로우 선택
3. 최근 실행 결과 확인

### NPM 패키지 확인

- 패키지 페이지: https://www.npmjs.com/package/@byzip/types
- 설치 확인: `npm info @byzip/types`

## 🐛 문제 해결

### 1. 배포 실패: "You must be logged in to publish packages"

**원인**: NPM_TOKEN이 설정되지 않았거나 만료됨
**해결**: GitHub Secrets에 NPM_TOKEN 재설정

### 2. 배포 실패: "Cannot publish over existing version"

**원인**: 동일한 버전이 이미 배포됨
**해결**: 워크플로우가 자동으로 버전을 증가시킴 (수정 불필요)

### 3. 타입 추출 오류

**원인**: 스크립트 실행 권한 없음
**해결**:

```bash
chmod +x scripts/extract-types.sh
```

### 4. 빌드 오류

**원인**: TypeScript 컴파일 오류
**해결**:

```bash
cd sdk-package
npm run build  # 로컬에서 빌드 테스트
```

## 📝 패키지 정보

현재 패키지 이름: `byzip-v2-sdk`

패키지 이름을 변경하려면:

1. `sdk-package/package.json`에서 `name` 필드 수정
2. README.md 및 문서 업데이트

## 🎯 다음 단계

1. ✅ NPM 토큰 생성
2. ✅ GitHub Secrets 설정
3. ✅ 타입 파일 수정하여 테스트
4. ✅ GitHub에 푸시 (`main` 또는 `dev` 브랜치)
5. ✅ Actions 탭에서 배포 확인
6. ✅ NPM에서 패키지 확인

## 📚 프론트엔드에서 사용하기

```bash
# 설치
npm install byzip-v2-sdk

# 사용
import {
  LoginRequestDto,
  UsersRolesEnum,
  createSuccessResponse
} from 'byzip-v2-sdk';
```

## 💡 유용한 명령어

```bash
# 현재 배포된 버전 확인
npm view byzip-v2-sdk version

# 모든 버전 목록
npm view byzip-v2-sdk versions

# 최신 버전 설치
npm install byzip-v2-sdk@latest

# 특정 버전 설치
npm install byzip-v2-sdk@1.0.5

# 로컬에서 SDK 빌드 테스트
npm run sdk:build
```

## 🔧 로컬에서 테스트

```bash
# 1. 타입 추출
npm run sdk:extract

# 2. SDK 디렉토리로 이동하여 빌드
cd sdk-package
npm install
npm run build

# 3. 생성된 dist 폴더 확인
ls -la dist/
```
