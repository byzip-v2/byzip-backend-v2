#!/bin/bash

echo "🚨 Git 히스토리에서 .env 파일 제거"
echo "⚠️  경고: 이 작업은 되돌릴 수 없습니다!"
echo ""
read -p "계속하시겠습니까? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "취소되었습니다."
  exit 0
fi

echo ""
echo "📥 BFG Repo-Cleaner 다운로드 중..."

# BFG JAR 파일 다운로드
if [ ! -f "bfg.jar" ]; then
  curl -L https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar -o bfg.jar
  if [ $? -ne 0 ]; then
    echo "❌ BFG 다운로드 실패"
    exit 1
  fi
fi

echo "✅ BFG 준비 완료"
echo ""

# 현재 디렉토리 확인
REPO_DIR=$(pwd)
echo "📂 작업 디렉토리: $REPO_DIR"
echo ""

# .env 파일 백업
echo "💾 현재 .env 파일 백업 중..."
if [ -f ".env.development" ]; then
  cp .env.development .env.development.backup
fi
if [ -f ".env.production" ]; then
  cp .env.production .env.production.backup
fi

echo "🗑️  Git 히스토리에서 .env 파일 제거 중..."
echo ""

# BFG로 .env 파일 제거
java -jar bfg.jar --delete-files .env.development
java -jar bfg.jar --delete-files .env.production
java -jar bfg.jar --delete-files .env

# Git 정리
echo ""
echo "🧹 Git 저장소 정리 중..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ 히스토리 정리 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. git push origin --force --all"
echo "2. 팀원들에게 저장소 재클론 요청"
echo "3. 백업된 .env 파일 확인: .env.*.backup"
echo ""
echo "⚠️  Force Push 전에 팀원들에게 알려주세요!"

