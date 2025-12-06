import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

// 주택 공급 정보 생성 요청 DTO (스케줄러에서만 사용, 일반 사용자는 생성 불가)
export class CreateHousingSupplyDto {
  @ApiPropertyOptional({ description: '주택관리번호' })
  @IsString()
  @IsOptional()
  houseManageNo?: string;

  @ApiProperty({ description: '공고번호 (유니크)', example: '2025000565' })
  @IsString()
  pblancNo: string;

  @ApiPropertyOptional({ description: '주택명', example: '대상 웰라움 순창' })
  @IsString()
  @IsOptional()
  houseName?: string;

  @ApiPropertyOptional({ description: '주택구분코드', example: '01' })
  @IsString()
  @IsOptional()
  houseSecd?: string;

  @ApiPropertyOptional({ description: '주택구분코드명', example: 'APT' })
  @IsString()
  @IsOptional()
  houseSecdNm?: string;

  @ApiPropertyOptional({ description: '주택상세구분코드', example: '01' })
  @IsString()
  @IsOptional()
  houseDtlSecd?: string;

  @ApiPropertyOptional({ description: '주택상세구분코드명', example: '민영' })
  @IsString()
  @IsOptional()
  houseDtlSecdNm?: string;

  @ApiPropertyOptional({ description: '분양구분코드', example: '0' })
  @IsString()
  @IsOptional()
  rentSecd?: string;

  @ApiPropertyOptional({ description: '분양구분코드명', example: '분양주택' })
  @IsString()
  @IsOptional()
  rentSecdNm?: string;

  @ApiPropertyOptional({ description: '공급지역코드', example: '560' })
  @IsString()
  @IsOptional()
  subscrptAreaCode?: string;

  @ApiPropertyOptional({ description: '공급지역명', example: '전북' })
  @IsString()
  @IsOptional()
  subscrptAreaCodeNm?: string;

  @ApiPropertyOptional({ description: '공급위치 우편번호', example: '56037' })
  @IsString()
  @IsOptional()
  hssplyZip?: string;

  @ApiPropertyOptional({
    description: '공급위치',
    example: '전북특별자치도 순창군 순창읍 순화리 951 번지 일원',
  })
  @IsString()
  @IsOptional()
  hssplyAdres?: string;

  @ApiPropertyOptional({ description: '위도', example: 37.3595963 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: '경도', example: 127.1054328 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ description: '공급규모', example: 264 })
  @IsInt()
  @IsOptional()
  totSuplyHshldco?: number;

  @ApiPropertyOptional({ description: '공고일', example: '2025-11-14' })
  @IsDateString()
  @IsOptional()
  rcritPblancDe?: string;

  @ApiPropertyOptional({ description: '청약접수시작일', example: '2025-11-19' })
  @IsDateString()
  @IsOptional()
  rceptBgnde?: string;

  @ApiPropertyOptional({ description: '청약접수종료일', example: '2025-11-21' })
  @IsDateString()
  @IsOptional()
  rceptEndde?: string;

  @ApiPropertyOptional({
    description: '특별공급 접수시작일',
    example: '2025-11-19',
  })
  @IsDateString()
  @IsOptional()
  spsplyRceptBgnde?: string;

  @ApiPropertyOptional({
    description: '특별공급 접수종료일',
    example: '2025-11-19',
  })
  @IsDateString()
  @IsOptional()
  spsplyRceptEndde?: string;

  @ApiPropertyOptional({ description: '당첨자발표일', example: '2025-11-27' })
  @IsDateString()
  @IsOptional()
  przwnerPresnatnDe?: string;

  @ApiPropertyOptional({ description: '계약시작일', example: '2025-12-08' })
  @IsDateString()
  @IsOptional()
  cntrctCnclsBgnde?: string;

  @ApiPropertyOptional({ description: '계약종료일', example: '2025-12-10' })
  @IsDateString()
  @IsOptional()
  cntrctCnclsEndde?: string;

  @ApiPropertyOptional({ description: '입주예정월', example: '202711' })
  @IsString()
  @IsOptional()
  mvnPrearngeYm?: string;

  @ApiPropertyOptional({ description: '홈페이지주소' })
  @IsString()
  @IsOptional()
  hmpgAdres?: string;

  @ApiPropertyOptional({ description: '분양정보 URL' })
  @IsString()
  @IsOptional()
  pblancUrl?: string;

  @ApiPropertyOptional({ description: '문의처' })
  @IsString()
  @IsOptional()
  mdhsTelno?: string;

  @ApiPropertyOptional({ description: '건설업체명(시공사)' })
  @IsString()
  @IsOptional()
  cnstrctEntrpsNm?: string;

  @ApiPropertyOptional({ description: '사업주체명(시행사)' })
  @IsString()
  @IsOptional()
  bsnsMbyNm?: string;

  @ApiPropertyOptional({ description: '신문사' })
  @IsString()
  @IsOptional()
  nsprcNm?: string;

  @ApiPropertyOptional({ description: '투기과열지구 (Y/N)' })
  @IsString()
  @IsOptional()
  specltRdnEarthAt?: string;

  @ApiPropertyOptional({ description: '조정대상지역 (Y/N)' })
  @IsString()
  @IsOptional()
  mdatTrgetAreaSecd?: string;

  @ApiPropertyOptional({ description: '분양가상한제 (Y/N)' })
  @IsString()
  @IsOptional()
  parcprcUlsAt?: string;

  @ApiPropertyOptional({ description: '정비사업 (Y/N)' })
  @IsString()
  @IsOptional()
  imprmnBsnsAt?: string;

  @ApiPropertyOptional({ description: '공공주택지구 (Y/N)' })
  @IsString()
  @IsOptional()
  publicHouseEarthAt?: string;

  @ApiPropertyOptional({ description: '대규모 택지개발지구 (Y/N)' })
  @IsString()
  @IsOptional()
  lrsclBldlndAt?: string;

  @ApiPropertyOptional({
    description: '수도권 내 민영 공공주택지구 (Y/N)',
  })
  @IsString()
  @IsOptional()
  nplnPrvoprPublicHouseAt?: string;

  @ApiPropertyOptional({ description: '공공주택 특별법 적용 여부 (Y/N)' })
  @IsString()
  @IsOptional()
  publicHouseSpclwApplcAt?: string;
}

// 주택 공급 정보 업데이트 요청 DTO
export class UpdateHousingSupplyDto {
  @ApiPropertyOptional({ description: '주택명' })
  @IsString()
  @IsOptional()
  houseName?: string;

  @ApiPropertyOptional({ description: '공급지역명' })
  @IsString()
  @IsOptional()
  subscrptAreaCodeNm?: string;

  @ApiPropertyOptional({ description: '공급위치' })
  @IsString()
  @IsOptional()
  hssplyAdres?: string;

  @ApiPropertyOptional({ description: '위도' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: '경도' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ description: '공급규모' })
  @IsInt()
  @IsOptional()
  totSuplyHshldco?: number;

  @ApiPropertyOptional({ description: '공고일' })
  @IsDateString()
  @IsOptional()
  rcritPblancDe?: string;

  @ApiPropertyOptional({ description: '청약접수시작일' })
  @IsDateString()
  @IsOptional()
  rceptBgnde?: string;

  @ApiPropertyOptional({ description: '청약접수종료일' })
  @IsDateString()
  @IsOptional()
  rceptEndde?: string;

  @ApiPropertyOptional({ description: '문의처' })
  @IsString()
  @IsOptional()
  mdhsTelno?: string;
}

// 주택 공급 정보 조회 쿼리 DTO
export class GetHousingSuppliesQueryDto {
  @ApiPropertyOptional({
    description: '검색어 (주택명, 주소, 공고번호에서 검색)',
    example: '순창',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: '주택구분코드 필터 (01: APT, 09: 민간사전청약, 10: 신혼희망타운)',
    example: '01',
  })
  @IsString()
  @IsOptional()
  houseSecd?: string;

  @ApiPropertyOptional({
    description: '주택구분코드명 필터',
    example: 'APT',
  })
  @IsString()
  @IsOptional()
  houseSecdNm?: string;

  @ApiPropertyOptional({
    description: '주택상세구분코드 필터 (01: 민영, 03: 국민)',
    example: '01',
  })
  @IsString()
  @IsOptional()
  houseDtlSecd?: string;

  @ApiPropertyOptional({
    description: '분양구분코드 필터 (0: 분양주택, 1: 분양전환 가능임대)',
    example: '0',
  })
  @IsString()
  @IsOptional()
  rentSecd?: string;

  @ApiPropertyOptional({
    description: '공급지역명 필터',
    example: '전북',
  })
  @IsString()
  @IsOptional()
  subscrptAreaCodeNm?: string;

  @ApiPropertyOptional({
    description: '공고일 시작일 (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  rcritPblancDeFrom?: string;

  @ApiPropertyOptional({
    description: '공고일 종료일 (YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  rcritPblancDeTo?: string;

  @ApiPropertyOptional({
    description: '청약접수시작일 시작일 (YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  rceptBgndeFrom?: string;

  @ApiPropertyOptional({
    description: '청약접수시작일 종료일 (YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  rceptBgndeTo?: string;

  @ApiPropertyOptional({
    description: '분양가상한제 필터 (Y/N)',
    example: 'Y',
  })
  @IsString()
  @IsOptional()
  parcprcUlsAt?: string;

  @ApiPropertyOptional({
    description: '투기과열지구 필터 (Y/N)',
    example: 'N',
  })
  @IsString()
  @IsOptional()
  specltRdnEarthAt?: string;

  @ApiPropertyOptional({
    description: '페이지 번호 (1부터 시작)',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: '페이지당 항목 수 (최대 100)',
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: '정렬 기준 필드',
    example: 'rcritPblancDe',
    default: 'rcritPblancDe',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: '정렬 순서 (ASC 또는 DESC)',
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

// 페이징 메타데이터 DTO
export class PaginationMetaDto {
  @ApiProperty({ description: '현재 페이지', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 10 })
  limit: number;

  @ApiProperty({ description: '전체 항목 수', example: 100 })
  total: number;

  @ApiProperty({ description: '전체 페이지 수', example: 10 })
  totalPages: number;

  @ApiProperty({ description: '현재 페이지 항목 수', example: 10 })
  itemCount: number;
}

// 주택 공급 정보 응답 데이터 DTO
export class HousingSupplyDataDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiPropertyOptional({ description: '주택관리번호' })
  houseManageNo?: string;

  @ApiPropertyOptional({ description: '공고번호' })
  pblancNo?: string;

  @ApiPropertyOptional({ description: '주택명' })
  houseName?: string;

  @ApiPropertyOptional({ description: '주택구분코드' })
  houseSecd?: string;

  @ApiPropertyOptional({ description: '주택구분코드명' })
  houseSecdNm?: string;

  @ApiPropertyOptional({ description: '주택상세구분코드' })
  houseDtlSecd?: string;

  @ApiPropertyOptional({ description: '주택상세구분코드명' })
  houseDtlSecdNm?: string;

  @ApiPropertyOptional({ description: '분양구분코드' })
  rentSecd?: string;

  @ApiPropertyOptional({ description: '분양구분코드명' })
  rentSecdNm?: string;

  @ApiPropertyOptional({ description: '공급지역코드' })
  subscrptAreaCode?: string;

  @ApiPropertyOptional({ description: '공급지역명' })
  subscrptAreaCodeNm?: string;

  @ApiPropertyOptional({ description: '공급위치 우편번호' })
  hssplyZip?: string;

  @ApiPropertyOptional({ description: '공급위치' })
  hssplyAdres?: string;

  @ApiPropertyOptional({ description: '위도' })
  latitude?: number;

  @ApiPropertyOptional({ description: '경도' })
  longitude?: number;

  @ApiPropertyOptional({ description: '공급규모' })
  totSuplyHshldco?: number;

  @ApiPropertyOptional({ description: '공고일' })
  rcritPblancDe?: Date;

  @ApiPropertyOptional({ description: '청약접수시작일' })
  rceptBgnde?: Date;

  @ApiPropertyOptional({ description: '청약접수종료일' })
  rceptEndde?: Date;

  @ApiPropertyOptional({ description: '특별공급 접수시작일' })
  spsplyRceptBgnde?: Date;

  @ApiPropertyOptional({ description: '특별공급 접수종료일' })
  spsplyRceptEndde?: Date;

  @ApiPropertyOptional({ description: '당첨자발표일' })
  przwnerPresnatnDe?: Date;

  @ApiPropertyOptional({ description: '계약시작일' })
  cntrctCnclsBgnde?: Date;

  @ApiPropertyOptional({ description: '계약종료일' })
  cntrctCnclsEndde?: Date;

  @ApiPropertyOptional({ description: '입주예정월' })
  mvnPrearngeYm?: Date;

  @ApiPropertyOptional({ description: '홈페이지주소' })
  hmpgAdres?: string;

  @ApiPropertyOptional({ description: '분양정보 URL' })
  pblancUrl?: string;

  @ApiPropertyOptional({ description: '문의처' })
  mdhsTelno?: string;

  @ApiPropertyOptional({ description: '건설업체명(시공사)' })
  cnstrctEntrpsNm?: string;

  @ApiPropertyOptional({ description: '사업주체명(시행사)' })
  bsnsMbyNm?: string;

  @ApiPropertyOptional({ description: '신문사' })
  nsprcNm?: string;

  @ApiPropertyOptional({ description: '투기과열지구 (Y/N)' })
  specltRdnEarthAt?: string;

  @ApiPropertyOptional({ description: '조정대상지역 (Y/N)' })
  mdatTrgetAreaSecd?: string;

  @ApiPropertyOptional({ description: '분양가상한제 (Y/N)' })
  parcprcUlsAt?: string;

  @ApiPropertyOptional({ description: '정비사업 (Y/N)' })
  imprmnBsnsAt?: string;

  @ApiPropertyOptional({ description: '공공주택지구 (Y/N)' })
  publicHouseEarthAt?: string;

  @ApiPropertyOptional({ description: '대규모 택지개발지구 (Y/N)' })
  lrsclBldlndAt?: string;

  @ApiPropertyOptional({
    description: '수도권 내 민영 공공주택지구 (Y/N)',
  })
  nplnPrvoprPublicHouseAt?: string;

  @ApiPropertyOptional({ description: '공공주택 특별법 적용 여부 (Y/N)' })
  publicHouseSpclwApplcAt?: string;

  @ApiProperty({ description: '데이터 수집 일시' })
  collectedAt: Date;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  updatedAt: Date;
}

// 단일 주택 공급 정보 조회 응답
export class GetHousingSupplyResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: HousingSupplyDataDto })
  data: HousingSupplyDataDto;
}

// 주택 공급 정보 목록 조회 응답
export class GetHousingSuppliesResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: [HousingSupplyDataDto] })
  data: HousingSupplyDataDto[];

  @ApiProperty({ type: PaginationMetaDto, description: '페이징 정보' })
  meta: PaginationMetaDto;
}

// 주택 공급 정보 생성 응답
export class CreateHousingSupplyResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: HousingSupplyDataDto })
  data: HousingSupplyDataDto;
}

// 주택 공급 정보 업데이트 응답
export class UpdateHousingSupplyResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;

  @ApiProperty({ type: HousingSupplyDataDto })
  data: HousingSupplyDataDto;
}

// 주택 공급 정보 삭제 응답
export class DeleteHousingSupplyResponseDto {
  @ApiProperty({ description: '요청 성공 여부', example: true })
  success: boolean;

  @ApiProperty({ description: '응답 메시지' })
  message: string;
}

