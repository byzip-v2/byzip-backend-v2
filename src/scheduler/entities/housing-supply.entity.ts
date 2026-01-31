import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('housing_supplies')
export class HousingSupply {
  @PrimaryGeneratedColumn()
  id: number;

  // 공공데이터 API에서 받은 원본 데이터 (JSON)
  @Column({ type: 'jsonb' })
  rawData: Record<string, any>;

  // === 기본 정보 ===
  @Column({ nullable: true })
  houseManageNo?: string; // 주택관리번호

  @Column({ nullable: true, unique: true })
  pblancNo?: string; // 공고번호 (유니크 키)

  @Column({ nullable: true })
  houseName?: string; // 주택명

  @Column({ nullable: true })
  houseSecd?: string; // 주택구분코드 (01: APT, 09: 민간사전청약, 10: 신혼희망타운)

  @Column({ nullable: true })
  houseSecdNm?: string; // 주택구분코드명

  @Column({ nullable: true })
  houseDtlSecd?: string; // 주택상세구분코드 (01: 민영, 03: 국민)

  @Column({ nullable: true })
  houseDtlSecdNm?: string; // 주택상세구분코드명

  @Column({ nullable: true })
  rentSecd?: string; // 분양구분코드 (0: 분양주택, 1: 분양전환 가능임대)

  @Column({ nullable: true })
  rentSecdNm?: string; // 분양구분코드명

  // === 지역 정보 ===
  @Column({ nullable: true })
  subscrptAreaCode?: string; // 공급지역코드

  @Column({ nullable: true })
  subscrptAreaCodeNm?: string; // 공급지역명

  @Column({ nullable: true })
  hssplyZip?: string; // 공급위치 우편번호

  @Column({ type: 'text', nullable: true })
  hssplyAdres?: string; // 공급위치

  // === 위치 좌표 ===
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number; // 위도

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number; // 경도

  // === 규모 및 일정 ===
  @Column({ nullable: true })
  totSuplyHshldco?: number; // 공급규모

  @Column({ type: 'date', nullable: true })
  rcritPblancDe?: Date; // 공고일

  @Column({ type: 'date', nullable: true })
  rceptBgnde?: Date; // 청약접수시작일

  @Column({ type: 'date', nullable: true })
  rceptEndde?: Date; // 청약접수종료일

  @Column({ type: 'date', nullable: true })
  spsplyRceptBgnde?: Date; // 특별공급 접수시작일

  @Column({ type: 'date', nullable: true })
  spsplyRceptEndde?: Date; // 특별공급 접수종료일

  @Column({ type: 'date', nullable: true })
  przwnerPresnatnDe?: Date; // 당첨자발표일

  @Column({ type: 'date', nullable: true })
  cntrctCnclsBgnde?: Date; // 계약시작일

  @Column({ type: 'date', nullable: true })
  cntrctCnclsEndde?: Date; // 계약종료일

  @Column({ type: 'date', nullable: true })
  mvnPrearngeYm?: Date; // 입주예정월 (문자열을 Date로 변환)

  // === 연락처 및 URL ===
  @Column({ nullable: true })
  hmpgAdres?: string; // 홈페이지주소

  @Column({ nullable: true })
  pblancUrl?: string; // 분양정보 URL

  @Column({ nullable: true })
  mdhsTelno?: string; // 문의처

  // === 사업주체 정보 ===
  @Column({ nullable: true })
  cnstrctEntrpsNm?: string; // 건설업체명(시공사)

  @Column({ nullable: true })
  bsnsMbyNm?: string; // 사업주체명(시행사)

  @Column({ nullable: true })
  nsprcNm?: string; // 신문사

  // === 특성 플래그 ===
  @Column({ nullable: true })
  specltRdnEarthAt?: string; // 투기과열지구 (Y/N)

  @Column({ nullable: true })
  mdatTrgetAreaSecd?: string; // 조정대상지역 (Y/N)

  @Column({ nullable: true })
  parcprcUlsAt?: string; // 분양가상한제 (Y/N)

  @Column({ nullable: true })
  imprmnBsnsAt?: string; // 정비사업 (Y/N)

  @Column({ nullable: true })
  publicHouseEarthAt?: string; // 공공주택지구 (Y/N)

  @Column({ nullable: true })
  lrsclBldlndAt?: string; // 대규모 택지개발지구 (Y/N)

  @Column({ nullable: true })
  nplnPrvoprPublicHouseAt?: string; // 수도권 내 민영 공공주택지구 (Y/N)

  @Column({ nullable: true })
  publicHouseSpclwApplcAt?: string; // 공공주택 특별법 적용 여부 (Y/N)

  // === 순위별 접수일정 (1순위) ===
  @Column({ type: 'date', nullable: true })
  gnrlRnk1CrspareaRcptde?: Date; // 1순위 해당지역 접수시작일

  @Column({ type: 'date', nullable: true })
  gnrlRnk1CrspareaEndde?: Date; // 1순위 해당지역 접수종료일

  @Column({ type: 'date', nullable: true })
  gnrlRnk1EtcGgRcptde?: Date; // 1순위 경기지역 접수시작일

  @Column({ type: 'date', nullable: true })
  gnrlRnk1EtcGgEndde?: Date; // 1순위 경기지역 접수종료일

  @Column({ type: 'date', nullable: true })
  gnrlRnk1EtcAreaRcptde?: Date; // 1순위 기타지역 접수시작일

  @Column({ type: 'date', nullable: true })
  gnrlRnk1EtcAreaEndde?: Date; // 1순위 기타지역 접수종료일

  // === 순위별 접수일정 (2순위) ===
  @Column({ type: 'date', nullable: true })
  gnrlRnk2CrspareaRcptde?: Date; // 2순위 해당지역 접수시작일

  @Column({ type: 'date', nullable: true })
  gnrlRnk2CrspareaEndde?: Date; // 2순위 해당지역 접수종료일

  @Column({ type: 'date', nullable: true })
  gnrlRnk2EtcGgRcptde?: Date; // 2순위 경기지역 접수시작일

  @Column({ type: 'date', nullable: true })
  gnrlRnk2EtcGgEndde?: Date; // 2순위 경기지역 접수종료일

  @Column({ type: 'date', nullable: true })
  gnrlRnk2EtcAreaRcptde?: Date; // 2순위 기타지역 접수시작일

  @Column({ type: 'date', nullable: true })
  gnrlRnk2EtcAreaEndde?: Date; // 2순위 기타지역 접수종료일

  // 데이터 수집 일시 (스케줄러 실행 시간)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  collectedAt: Date;

  // 숨김 여부 (목록에서 숨김 처리)
  @Column({ name: 'is_hidden', type: 'boolean', default: false })
  isHidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

