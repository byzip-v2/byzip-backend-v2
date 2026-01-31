-- housing_supplies 테이블에 숨김여부(is_hidden) 컬럼 추가
-- Production 데이터베이스에서 실행하세요

ALTER TABLE "housing_supplies"
ADD COLUMN IF NOT EXISTS "is_hidden" BOOLEAN DEFAULT false;
