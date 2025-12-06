-- bug_reports 테이블에 memo 컬럼 추가
-- Production 데이터베이스에서 실행하세요

ALTER TABLE "bug_reports" 
ADD COLUMN IF NOT EXISTS "memo" TEXT;

