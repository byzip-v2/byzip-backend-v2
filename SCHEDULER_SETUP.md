# 스케줄러 설정 가이드

## 📋 개요

매일 오전 3시에 공공데이터 포털에서 API를 호출하여 데이터를 수집하고 DB에 저장하는 스케줄러입니다.

## 🏗️ 구조

```
scheduler/
  ├── entities/
  │   └── housing-supply.entity.ts    # 분양정보 엔티티
  ├── services/
  │   └── public-data.service.ts      # 공공데이터 API 호출 서비스
  ├── scheduler.controller.ts         # 스케줄러 엔드포인트
  ├── scheduler.service.ts            # 스케줄러 오케스트레이션
  └── scheduler.module.ts             # 스케줄러 모듈
```

## ⚙️ 설정 방법

### 1. 환경 변수 설정

Vercel 대시보드 또는 `.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# 공공데이터 포털 API 키 (공공데이터 포털에서 발급받은 키)
PUBLIC_DATA_HOME__API_KEY=your-api-key-here
```

**⚠️ 중요**: API 키는 절대 코드에 하드코딩하지 마세요. 환경 변수로만 관리하세요.

### 2. GitHub Secrets 설정 (선택사항)

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 시크릿을 추가할 수 있습니다:

- `SCHEDULER_API_URL`: 스케줄러 엔드포인트 URL (기본값: `https://api.by-zip.com/api/scheduler/public-data`)

### 3. API 엔드포인트 수정 필요

현재 `public-data.service.ts`의 API 엔드포인트는 예시입니다. 실제 API 명세서(Swagger)를 확인하여 다음을 수정해야 합니다:

1. **API 엔드포인트 URL** 수정

   ```typescript
   // public-data.service.ts의 fetchAndSaveHousingSupply() 메서드
   const apiUrl = `${this.baseUrl}/실제-서비스-ID/실제-엔드포인트`;
   ```

2. **파라미터** 확인 및 수정

   ```typescript
   const params = new URLSearchParams({
     serviceKey: this.apiKey,
     // 실제 API에서 요구하는 파라미터 추가
   });
   ```

3. **응답 데이터 구조** 확인 및 수정
   ```typescript
   // processAndSaveData() 메서드에서 실제 응답 구조에 맞게 수정
   const items = apiResponse.data || apiResponse.body?.items || [];
   ```

## 🚀 사용 방법

### 수동 실행

GitHub Actions에서 수동으로 실행:

1. GitHub 저장소 → Actions 탭
2. "Public Data Scheduler" 워크플로우 선택
3. "Run workflow" 버튼 클릭

### 자동 실행

매일 오전 3시(KST)에 자동으로 실행됩니다.

## 📊 API 엔드포인트

### 스케줄러 트리거

```
GET /api/scheduler/public-data
```

**응답 예시:**

```json
{
  "success": true,
  "message": "스케줄러 작업이 성공적으로 완료되었습니다",
  "timestamp": "2025-01-15T03:00:00.000Z",
  "results": [
    {
      "serviceName": "공공데이터에서 분양정보 추가",
      "success": true,
      "savedCount": 150,
      "error": null
    }
  ]
}
```

## 🔧 추후 확장 방법

추후 다른 공공데이터 API를 추가하려면:

1. **새 서비스 생성**

   ```typescript
   // scheduler/services/public-data-2.service.ts
   @Injectable()
   export class PublicData2Service {
     async fetchAndSave(): Promise<{...}> {
       // API 호출 및 저장 로직
     }
   }
   ```

2. **SchedulerModule에 추가**

   ```typescript
   providers: [SchedulerService, PublicDataService, PublicData2Service];
   ```

3. **SchedulerService에서 호출**

   ```typescript
   async runAllScheduledTasks() {
     // 기존 API 호출
     await this.publicDataService.fetchAndSaveHousingSupply();

     // 새 API 호출 추가
     await this.publicData2Service.fetchAndSave();
   }
   ```

## ⚠️ 주의사항

1. **API 키 보안**: API 키는 절대 코드에 하드코딩하지 마세요. 환경 변수로만 관리하세요.
2. **트래픽 제한**: 공공데이터 포털의 트래픽 제한을 확인하세요 (개발계정: 40,000건/일)
3. **에러 처리**: API 호출 실패 시 로그를 확인하고 재시도 로직을 고려하세요.
4. **데이터 중복**: `pblancId`를 사용하여 중복 데이터를 방지합니다.

## 🐛 문제 해결

### 스케줄러가 실행되지 않는 경우

1. GitHub Actions 워크플로우가 활성화되어 있는지 확인
2. Cron 표현식이 올바른지 확인 (`0 18 * * *` = UTC 18시 = KST 오전 3시)
3. `SCHEDULER_API_URL`이 올바르게 설정되어 있는지 확인 (선택사항, 기본값 사용 가능)

### API 호출 실패

1. `public-data.service.ts`의 API 엔드포인트가 올바른지 확인
2. API 키가 유효한지 확인
3. 공공데이터 포털에서 API 활용신청이 완료되었는지 확인

### 데이터 저장 실패

1. 데이터베이스 연결 확인
2. 엔티티 구조가 API 응답과 일치하는지 확인
3. 로그에서 구체적인 에러 메시지 확인
