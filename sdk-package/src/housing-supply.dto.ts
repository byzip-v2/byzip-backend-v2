
// 주택 공급 정보 생성 요청 DTO (스케줄러에서만 사용, 일반 사용자는 생성 불가)
export interface CreateHousingSupplyDto {
  houseManageNo?: string;

  pblancNo: string;

  houseName?: string;

  houseSecd?: string;

  houseSecdNm?: string;

  houseDtlSecd?: string;

  houseDtlSecdNm?: string;

  rentSecd?: string;

  rentSecdNm?: string;

  subscrptAreaCode?: string;

  subscrptAreaCodeNm?: string;

  hssplyZip?: string;

  hssplyAdres?: string;

  latitude?: number;

  longitude?: number;

  totSuplyHshldco?: number;

  rcritPblancDe?: string;

  rceptBgnde?: string;

  rceptEndde?: string;

  spsplyRceptBgnde?: string;

  spsplyRceptEndde?: string;

  przwnerPresnatnDe?: string;

  cntrctCnclsBgnde?: string;

  cntrctCnclsEndde?: string;

  mvnPrearngeYm?: string;

  hmpgAdres?: string;

  pblancUrl?: string;

  mdhsTelno?: string;

  cnstrctEntrpsNm?: string;

  bsnsMbyNm?: string;

  nsprcNm?: string;

  specltRdnEarthAt?: string;

  mdatTrgetAreaSecd?: string;

  parcprcUlsAt?: string;

  imprmnBsnsAt?: string;

  publicHouseEarthAt?: string;

  lrsclBldlndAt?: string;

  nplnPrvoprPublicHouseAt?: string;

  publicHouseSpclwApplcAt?: string;
}

// 주택 공급 정보 업데이트 요청 DTO
export interface UpdateHousingSupplyDto {
  houseName?: string;

  subscrptAreaCodeNm?: string;

  hssplyAdres?: string;

  latitude?: number;

  longitude?: number;

  totSuplyHshldco?: number;

  rcritPblancDe?: string;

  rceptBgnde?: string;

  rceptEndde?: string;

  mdhsTelno?: string;
}

// 주택 공급 정보 조회 쿼리 DTO
export interface GetHousingSuppliesQueryDto {
  search?: string;

  houseSecd?: string;

  houseSecdNm?: string;

  houseDtlSecd?: string;

  rentSecd?: string;

  subscrptAreaCodeNm?: string;

  rcritPblancDeFrom?: string;

  rcritPblancDeTo?: string;

  rceptBgndeFrom?: string;

  rceptBgndeTo?: string;

  parcprcUlsAt?: string;

  specltRdnEarthAt?: string;

  page?: number;

  limit?: number;

  sortBy?: string;

  sortOrder?: 'ASC' | 'DESC';
}

// 페이징 메타데이터 DTO
export interface PaginationMetaDto {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  itemCount: number;
}

// 주택 공급 정보 응답 데이터 DTO
export interface HousingSupplyDataDto {
  id: number;

  houseManageNo?: string;

  pblancNo?: string;

  houseName?: string;

  houseSecd?: string;

  houseSecdNm?: string;

  houseDtlSecd?: string;

  houseDtlSecdNm?: string;

  rentSecd?: string;

  rentSecdNm?: string;

  subscrptAreaCode?: string;

  subscrptAreaCodeNm?: string;

  hssplyZip?: string;

  hssplyAdres?: string;

  latitude?: number;

  longitude?: number;

  totSuplyHshldco?: number;

  rcritPblancDe?: Date;

  rceptBgnde?: Date;

  rceptEndde?: Date;

  spsplyRceptBgnde?: Date;

  spsplyRceptEndde?: Date;

  przwnerPresnatnDe?: Date;

  cntrctCnclsBgnde?: Date;

  cntrctCnclsEndde?: Date;

  mvnPrearngeYm?: Date;

  hmpgAdres?: string;

  pblancUrl?: string;

  mdhsTelno?: string;

  cnstrctEntrpsNm?: string;

  bsnsMbyNm?: string;

  nsprcNm?: string;

  specltRdnEarthAt?: string;

  mdatTrgetAreaSecd?: string;

  parcprcUlsAt?: string;

  imprmnBsnsAt?: string;

  publicHouseEarthAt?: string;

  lrsclBldlndAt?: string;

  nplnPrvoprPublicHouseAt?: string;

  publicHouseSpclwApplcAt?: string;

  collectedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

// 단일 주택 공급 정보 조회 응답
export interface GetHousingSupplyResponseDto {
  success: boolean;

  message: string;

  data: HousingSupplyDataDto;
}

// 주택 공급 정보 목록 조회 응답
export interface GetHousingSuppliesResponseDto {
  success: boolean;

  message: string;

  data: HousingSupplyDataDto[];

  meta: PaginationMetaDto;
}

// 주택 공급 정보 생성 응답
export interface CreateHousingSupplyResponseDto {
  success: boolean;

  message: string;

  data: HousingSupplyDataDto;
}

// 주택 공급 정보 업데이트 응답
export interface UpdateHousingSupplyResponseDto {
  success: boolean;

  message: string;

  data: HousingSupplyDataDto;
}

// 주택 공급 정보 삭제 응답
export interface DeleteHousingSupplyResponseDto {
  success: boolean;

  message: string;
}

