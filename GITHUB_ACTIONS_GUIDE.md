# GitHub Actions 자동 배포 가이드

## 🎯 개요

`src/types/` 디렉토리의 DTO 파일이 변경되어 `main` 또는 `dev` 브랜치에 푸시되면, 자동으로 다음 작업이 실행됩니다:

1. DTO 파일에서 NestJS 데코레이터 제거
2. `class` → `interface`로 변환
3. SDK 패키지 버전 자동 증가
4. NPM에 자동 배포

## 🚀 워크플로우 상세

### 트리거 조건

```yaml
on:
  push:
    branches:
      - main
      - dev
    paths:
      - 'src/types/**'
```

### 실행 단계

#### 1단계: 환경 설정

- Ubuntu 최신 버전에서 실행
- Node.js 20 설치
- NPM registry 설정

#### 2단계: 타입 추출

```bash
node scripts/extract-types.js
```

- `@ApiProperty` 데코레이터 제거
- `@nestjs/swagger` import 제거
- `export class` → `export interface` 변환
- constructor 및 static 메서드 제거

#### 3단계: SDK 빌드

```bash
cd sdk-package
npm install
npm run build
```

#### 4단계: 버전 업데이트

- 현재 버전 읽기: `1.0.2`
- 패치 버전 증가: `1.0.3`
- package.json 업데이트

#### 5단계: NPM 배포

```bash
npm publish
```

- `NPM_TOKEN` 시크릿 사용
- `byzip-v2-sdk` 패키지로 배포

## 📋 체크리스트

### 초기 설정 (한 번만)

- [ ] NPM 계정 생성
- [ ] NPM Access Token 생성 (Automation 타입)
- [ ] GitHub Secrets에 `NPM_TOKEN` 추가
- [ ] 워크플로우 파일 확인 (`.github/workflows/publish-sdk.yml`)

### 매 배포마다

- [ ] DTO 파일 수정
- [ ] 로컬에서 테스트 (`npm run sdk:build`)
- [ ] 변경사항 커밋
- [ ] `main` 또는 `dev` 브랜치에 푸시
- [ ] GitHub Actions 탭에서 진행 상황 확인
- [ ] NPM에서 새 버전 확인

## 🔍 배포 모니터링

### GitHub Actions에서 확인

1. 저장소 페이지 → **Actions** 탭
2. **Publish SDK to NPM** 워크플로우 선택
3. 최근 실행 클릭
4. 각 단계의 로그 확인

### 성공 시 출력 예시

```
🔍 DTO 및 타입 파일 추출 중...
  📄 처리 중: src/types/dto/auth/auth.dto.ts
  📄 처리 중: src/types/dto/user/user.dto.ts
  📄 생성: response.dto.ts (수동 생성)
✅ 타입 추출 완료!

현재 버전: 1.0.2
새 버전: 1.0.3

🎉 SDK 버전 1.0.3 배포 완료!
📦 패키지: byzip-v2-sdk
🔗 https://www.npmjs.com/package/byzip-v2-sdk
```

## ⚠️ 주의사항

### 1. 버전 관리

- 패치 버전은 자동으로 증가 (`1.0.2` → `1.0.3`)
- 마이너/메이저 버전 변경이 필요하면 수동으로 조정

### 2. 브랜치 전략

- `main`: 프로덕션 배포
- `dev`: 개발 버전 배포
- 필요시 브랜치별 다른 버전 전략 적용 가능

### 3. 배포 실패 대응

- GitHub Actions 로그 확인
- NPM 토큰 유효성 확인
- 로컬에서 `npm run sdk:build` 테스트
- 필요시 수동 배포: `npm run sdk:publish`

## 🛠️ 수동 배포

자동 배포가 실패하거나 긴급 배포가 필요한 경우:

```bash
# 1. 타입 추출 및 빌드
npm run sdk:build

# 2. SDK 디렉토리로 이동
cd sdk-package

# 3. 버전 수동 조정 (필요시)
npm version patch  # 1.0.2 → 1.0.3
npm version minor  # 1.0.2 → 1.1.0
npm version major  # 1.0.2 → 2.0.0

# 4. NPM 로그인 (한 번만)
npm login

# 5. 배포
npm publish
```

## 📊 배포 통계 확인

### NPM 웹사이트에서

1. https://www.npmjs.com/package/byzip-v2-sdk 접속
2. 다운로드 통계 확인
3. 버전 히스토리 확인

### 터미널에서

```bash
# 패키지 정보
npm info byzip-v2-sdk

# 다운로드 통계
npm view byzip-v2-sdk dist-tags
npm view byzip-v2-sdk versions

# 의존성 확인
npm view byzip-v2-sdk dependencies
```

## 🔐 보안

### NPM Token 관리

- **절대** 토큰을 코드에 포함하지 마세요
- GitHub Secrets에만 저장
- 주기적으로 토큰 갱신
- Automation 타입 토큰 사용 (읽기/쓰기 권한만)

### GitHub Secrets 접근

- 저장소 관리자만 접근 가능
- 토큰 값은 마스킹되어 로그에 표시되지 않음
- 토큰 변경 시 즉시 반영

## 📚 참고 자료

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [NPM Publishing 가이드](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
