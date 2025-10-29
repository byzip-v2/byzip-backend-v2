# 🔐 환경 변수 보안 정리 가이드

## ✅ 완료된 작업

1. ✅ `.gitignore` 업데이트 - `.env.*` 파일 제외
2. ✅ Git 캐시에서 `.env` 파일 제거
3. ✅ **Git Hooks 설정** - `.env` 파일 커밋 방지
4. ✅ `.env.example` 템플릿 생성

## 🚨 필수 조치사항

### 1단계: 노출된 비밀 정보 즉시 교체 (최우선!)

```bash
# ⚠️ 다음 정보들을 즉시 변경하세요:
# - 데이터베이스 비밀번호
# - JWT_SECRET
# - 모든 API 키
# - 클라우드 서비스 키
```

### 2단계: Git 히스토리 정리

**방법 1: BFG Repo-Cleaner 사용 (자동 스크립트)**

```bash
# 스크립트 실행
cd /Users/william/Documents/GitHub/byzip-be
./scripts/cleanup-env-history.sh

# Force Push
git push origin --force --all

# 팀원들에게 알림
```

**방법 2: git filter-repo 사용**

```bash
# 설치
pip install git-filter-repo

# 실행
git filter-repo --invert-paths \
  --path .env.development \
  --path .env.production \
  --force

# Force Push
git push origin --force --all
```

### 3단계: 팀원들에게 알림

```
📢 긴급 공지

Git 히스토리를 정리했습니다. 다음 작업을 수행해주세요:

1. 로컬 저장소 백업 (필요시)
2. 기존 저장소 삭제
3. 저장소 재클론
   git clone https://github.com/byzip-v2/byzip-backend-v2.git

4. .env 파일 재설정
   cp .env.example .env.development
   # 실제 환경 변수 값 입력
```

## 🛡️ Git Hooks 작동 확인

```bash
# 테스트: .env 파일 커밋 시도
echo "test" > .env.development
git add .env.development
git commit -m "test"

# 결과: ❌ 에러: .env 파일을 커밋하려고 합니다!
```

## 📝 .env 파일 사용 방법

### 개발 환경 설정

```bash
# .env.example을 복사
cp .env.example .env.development

# 실제 값 입력
vim .env.development
```

### 프로덕션 환경 설정

```bash
# .env.example을 복사
cp .env.example .env.production

# 실제 값 입력 (개발 환경과 다른 값 사용)
vim .env.production
```

## 🔍 확인사항

- [ ] 모든 민감한 정보 교체 완료
- [ ] Git 히스토리 정리 완료
- [ ] Force Push 완료
- [ ] 팀원들에게 재클론 요청 완료
- [ ] Git Hooks 작동 확인
- [ ] `.env.example`만 Git에 포함 확인

## 🚫 절대 하지 말 것

1. ❌ `.env` 파일을 Git에 커밋
2. ❌ 환경 변수를 코드에 하드코딩
3. ❌ `.gitignore` 수정 없이 env 파일 추가
4. ❌ 노출된 비밀 정보 교체 없이 히스토리만 삭제

## 📞 문제 발생 시

Git Hooks가 작동하지 않으면:

```bash
# Hooks 권한 확인
ls -la .git/hooks/pre-commit

# 실행 권한 부여
chmod +x .git/hooks/pre-commit

# 테스트
./git/hooks/pre-commit
```

---

**마지막 업데이트**: 2025-01-29
