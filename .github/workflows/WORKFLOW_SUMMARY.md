# GitHub Actions 워크플로우 요약

## 📦 publish-sdk.yml

### 목적

백엔드 DTO 타입이 변경될 때마다 자동으로 `byzip-v2-sdk` NPM 패키지를 배포합니다.

### 트리거

- **브랜치**: `main`, `dev`
- **파일 경로**: `src/types/**`

### 실행 조건

```yaml
✅ src/types/dto/auth/auth.dto.ts 수정 → 배포 실행
✅ src/types/dto/user/user.dto.ts 수정 → 배포 실행
✅ src/types/jwt.types.ts 수정 → 배포 실행
❌ src/auth/auth.service.ts 수정 → 배포 안 함
❌ README.md 수정 → 배포 안 함
```

### 단계별 설명

#### 1. 📥 Checkout 코드

```yaml
- uses: actions/checkout@v4
```

저장소 코드를 가져옵니다.

#### 2. 🔧 Node.js 설정

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: 'https://registry.npmjs.org'
```

Node.js 20 버전을 설치하고 NPM registry를 설정합니다.

#### 3. 🔍 타입 파일 추출

```yaml
- run: node scripts/extract-types.js
```

백엔드 DTO 파일에서:

- NestJS 데코레이터 제거
- `class` → `interface` 변환
- SDK용 순수 타입 파일 생성

**변환 예시:**

```typescript
// 백엔드 (src/types/dto/auth/auth.dto.ts)
export class LoginRequestDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 'user123',
  })
  userId: string;
}

// ↓ 변환 ↓

// SDK (sdk-package/src/auth.dto.ts)
export interface LoginRequestDto {
  userId: string;
}
```

#### 4. 📦 SDK 패키지 의존성 설치

```yaml
- working-directory: ./sdk-package
  run: npm install
```

TypeScript 컴파일러 등 개발 의존성을 설치합니다.

#### 5. 🏗️ SDK 패키지 빌드

```yaml
- working-directory: ./sdk-package
  run: npm run build
```

TypeScript → JavaScript + 타입 정의 파일 생성

- `src/*.ts` → `dist/*.js` + `dist/*.d.ts`

#### 6. 📊 버전 확인 및 업데이트

```yaml
- id: version
  run: |
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    # 패치 버전 자동 증가
    NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
    npm version $NEW_VERSION --no-git-tag-version
```

**버전 증가 규칙:**

- `1.0.2` → `1.0.3`
- `1.0.9` → `1.0.10`
- `1.0.99` → `1.0.100`

#### 7. 🚀 NPM에 배포

```yaml
- run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

새 버전을 NPM에 배포합니다.

#### 8. ✅ 배포 완료 알림

```yaml
- run: |
    echo "🎉 SDK 버전 ${{ steps.version.outputs.version }} 배포 완료!"
```

배포 성공 메시지를 출력합니다.

### 필요한 Secrets

| Secret 이름 | 설명                | 필수 |
| ----------- | ------------------- | ---- |
| `NPM_TOKEN` | NPM Automation 토큰 | ✅   |

### 실행 시간

평균 2-3분

### 비용

GitHub Actions 무료 한도 내 (Public 저장소는 무제한)

## 🔄 워크플로우 다이어그램

```
커밋 & 푸시 (main/dev)
    ↓
src/types/ 변경 감지?
    ↓ Yes
코드 체크아웃
    ↓
Node.js 20 설치
    ↓
타입 추출 (class → interface)
    ↓
SDK 빌드 (TS → JS)
    ↓
버전 자동 증가
    ↓
NPM 배포
    ↓
✅ 완료!
```

## 📝 로그 예시

### 성공 케이스

```
Run node scripts/extract-types.js
🔍 DTO 및 타입 파일 추출 중...
  📄 처리 중: src/types/dto/auth/auth.dto.ts -> sdk-package/src/auth.dto.ts
  📄 처리 중: src/types/dto/user/user.dto.ts -> sdk-package/src/user.dto.ts
  📄 생성: response.dto.ts (수동 생성)
  📄 복사 중: src/types/jwt.types.ts -> sdk-package/src/jwt.types.ts
✅ 타입 추출 완료!

Run npm run build
> byzip-v2-sdk@1.0.2 build
> tsc
✅ 빌드 완료

현재 버전: 1.0.2
새 버전: 1.0.3

Run npm publish
+ byzip-v2-sdk@1.0.3
✅ 배포 완료

🎉 SDK 버전 1.0.3 배포 완료!
📦 패키지: byzip-v2-sdk
🔗 https://www.npmjs.com/package/byzip-v2-sdk
```

### 실패 케이스

```
Error: npm ERR! 403 You must be logged in to publish packages
```

→ `NPM_TOKEN` 확인 필요

```
Error: Version 1.0.3 already exists
```

→ package.json 버전 확인

## 🎛️ 커스터마이징

### 다른 브랜치 추가

```yaml
on:
  push:
    branches:
      - main
      - dev
      - staging # 추가
```

### 수동 트리거 추가

```yaml
on:
  push:
    branches:
      - main
      - dev
  workflow_dispatch: # 수동 실행 버튼 추가
```

### Slack 알림 추가

```yaml
- name: Slack 알림
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'SDK v${{ steps.version.outputs.version }} 배포 완료!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```
