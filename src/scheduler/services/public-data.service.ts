import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HousingSupply } from '../entities/housing-supply.entity';

@Injectable()
export class PublicDataService {
  private readonly logger = new Logger(PublicDataService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly naverClientId: string | undefined;
  private readonly naverClientSecret: string | undefined;

  constructor(
    @InjectRepository(HousingSupply)
    private readonly housingSupplyRepository: Repository<HousingSupply>,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = 'https://api.odcloud.kr/api';
    const apiKey = this.configService.get<string>('DATA_HOME_API_KEY');
    console.log('apiKey', apiKey);

    // 환경 변수가 없어도 생성자는 성공하도록 변경
    // 실제 사용 시점에 검증하도록 변경
    this.apiKey = apiKey || '';
    this.naverClientId = this.configService.get<string>('NAVER_CLIENT_ID');
    this.naverClientSecret = this.configService.get<string>(
      'NAVER_CLIENT_SECRET',
    );
  }

  /**
   * 공공데이터 포털에서 APT 분양정보 조회 및 저장
   */
  async fetchAndSaveHousingSupply(): Promise<{
    success: boolean;
    message: string;
    savedCount: number;
    geocodingFailedCount: number;
    error?: string;
  }> {
    try {
      // 환경 변수 검증 (실제 사용 시점에 검증)
      if (!this.apiKey) {
        const errorMessage =
          'DATA_HOME_API_KEY 환경 변수가 설정되지 않았습니다. Vercel 환경 변수에 설정해주세요.';
        this.logger.error(errorMessage);
        return {
          success: false,
          message: errorMessage,
          savedCount: 0,
          geocodingFailedCount: 0,
          error: errorMessage,
        };
      }

      this.logger.log('공공데이터 API 호출 시작');

      const aptUrl = `${this.baseUrl}/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?&serviceKey=${this.apiKey}&page=1&perPage=10&&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=2023-01-01`;
      const urbtyUrl = `${this.baseUrl}/ApplyhomeInfoDetailSvc/v1/getUrbtyOfctlLttotPblancDetail?&serviceKey=${this.apiKey}&page=1&perPage=10&&cond%5BRCRIT_PBLANC_DE%3A%3AGTE%5D=2023-01-01`;

      let totalSavedCount = 0;
      let totalGeocodingFailedCount = 0;

      // 1. APT 분양정보 API 호출
      try {
        this.logger.log('APT 분양정보 API 호출 중...');
        const aptResponse = await fetch(aptUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!aptResponse.ok) {
          throw new Error(
            `APT API 호출 실패: ${aptResponse.status} ${aptResponse.statusText}`,
          );
        }

        const aptData = await aptResponse.json();
        this.logger.log(
          `APT API 응답 받음: ${JSON.stringify(aptData).substring(0, 200)}...`,
        );

        const { savedCount, geocodingFailedCount } =
          await this.processAndSaveData(aptData);
        totalSavedCount += savedCount;
        totalGeocodingFailedCount += geocodingFailedCount;
        this.logger.log(
          `APT 데이터 저장 완료: ${savedCount}건, 지오코딩 실패: ${geocodingFailedCount}건`,
        );
      } catch (aptError) {
        this.logger.error(
          `APT API 호출 실패: ${aptError instanceof Error ? aptError.message : 'Unknown error'}`,
        );
        // APT API 실패해도 도시형 API는 계속 진행
      }

      // 2. 도시형/오피스텔 분양정보 API 호출
      try {
        this.logger.log('도시형/오피스텔 분양정보 API 호출 중...');
        const urbtyResponse = await fetch(urbtyUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!urbtyResponse.ok) {
          throw new Error(
            `도시형 API 호출 실패: ${urbtyResponse.status} ${urbtyResponse.statusText}`,
          );
        }

        const urbtyData = await urbtyResponse.json();
        this.logger.log(
          `도시형 API 응답 받음: ${JSON.stringify(urbtyData).substring(0, 200)}...`,
        );

        const { savedCount, geocodingFailedCount } =
          await this.processAndSaveData(urbtyData);
        totalSavedCount += savedCount;
        totalGeocodingFailedCount += geocodingFailedCount;
        this.logger.log(
          `도시형 데이터 저장 완료: ${savedCount}건, 지오코딩 실패: ${geocodingFailedCount}건`,
        );
      } catch (urbtyError) {
        this.logger.error(
          `도시형 API 호출 실패: ${urbtyError instanceof Error ? urbtyError.message : 'Unknown error'}`,
        );
        // 도시형 API 실패해도 전체 프로세스는 계속
      }

      this.logger.log(
        `전체 데이터 저장 완료: 총 ${totalSavedCount}건, 지오코딩 실패: ${totalGeocodingFailedCount}건`,
      );

      return {
        success: true,
        message: '공공데이터 수집 및 저장 완료',
        savedCount: totalSavedCount,
        geocodingFailedCount: totalGeocodingFailedCount,
      };
    } catch (error) {
      this.logger.error(`공공데이터 수집 실패: ${error.message}`, error.stack);
      return {
        success: false,
        message: '공공데이터 수집 실패',
        savedCount: 0,
        geocodingFailedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * API 응답 데이터를 가공하여 DB에 저장
   */
  private async processAndSaveData(apiResponse: any): Promise<{
    savedCount: number;
    geocodingFailedCount: number;
  }> {
    let savedCount = 0;
    let geocodingFailedCount = 0;

    try {
      // API 응답 구조에 따라 데이터 추출
      const items = apiResponse.data || apiResponse.body?.items || [];

      if (!Array.isArray(items)) {
        this.logger.warn('응답 데이터가 배열 형식이 아닙니다');
        return { savedCount: 0, geocodingFailedCount: 0 };
      }

      for (const item of items) {
        try {
          // 아이템이 문자열인 경우 JSON 파싱 (이중 인용부호 처리)
          let parsedItem = item;
          if (typeof item === 'string') {
            try {
              parsedItem = JSON.parse(item);
            } catch {
              this.logger.warn('JSON 파싱 실패, 원본 데이터 사용');
              parsedItem = item;
            }
          }

          // 공고번호로 중복 체크 (유니크 키)
          const pblancNo = parsedItem.PBLANC_NO || parsedItem.pblancNo;
          if (!pblancNo) {
            this.logger.warn('공고번호(PBLANC_NO)가 없어 건너뜁니다');
            continue;
          }

          // 기존 데이터 확인
          const existing = await this.housingSupplyRepository.findOne({
            where: { pblancNo },
          });

          const mappedData = this.mapApiDataToEntity(parsedItem);

          // 주소가 있으면 지오코딩 수행 (기존 데이터에 좌표가 없을 때만)
          const address =
            parsedItem.HSSPLY_ADRES ||
            parsedItem.hssplyAdres ||
            mappedData.hssplyAdres;

          // 기존 데이터에 좌표가 없거나, 새 데이터인 경우에만 지오코딩 시도
          const needsGeocoding =
            address &&
            typeof address === 'string' &&
            (!existing || !existing.latitude || !existing.longitude) &&
            (!mappedData.latitude || !mappedData.longitude);

          if (needsGeocoding) {
            const coordinates = await this.geocodeAddress(address);
            if (coordinates) {
              mappedData.latitude = coordinates.latitude;
              mappedData.longitude = coordinates.longitude;
              this.logger.log(
                `지오코딩 성공: ${address} -> (${coordinates.latitude}, ${coordinates.longitude})`,
              );
            } else {
              // 지오코딩 실패
              geocodingFailedCount++;
              this.logger.warn(
                `지오코딩 실패: ${address} (공고번호: ${pblancNo})`,
              );
            }
          }

          // 데이터 업데이트 또는 추가
          if (existing) {
            // 기존 데이터 업데이트
            // 기존 좌표가 있으면 유지, 없으면 새로 지오코딩한 좌표 사용
            const updateData: Partial<HousingSupply> = {
              ...mappedData,
              rawData: parsedItem,
              collectedAt: new Date(),
            };

            // 기존 좌표가 있으면 유지
            if (existing.latitude && existing.longitude) {
              updateData.latitude = existing.latitude;
              updateData.longitude = existing.longitude;
            }

            await this.housingSupplyRepository.update(existing.id, updateData);
            this.logger.debug(`데이터 업데이트: 공고번호 ${pblancNo}`);
            savedCount++;
          } else {
            // 새 데이터 추가
            const housingSupply = this.housingSupplyRepository.create({
              ...mappedData,
              rawData: parsedItem,
              collectedAt: new Date(),
            });
            await this.housingSupplyRepository.save(housingSupply);
            this.logger.debug(`데이터 추가: 공고번호 ${pblancNo}`);
            savedCount++;
          }
        } catch (itemError) {
          this.logger.error(
            `개별 데이터 저장 실패: ${JSON.stringify(item).substring(0, 100)}`,
            itemError,
          );
          // 개별 아이템 실패해도 계속 진행
        }
      }

      return { savedCount, geocodingFailedCount };
    } catch (error) {
      this.logger.error(`데이터 처리 실패: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * API 응답 데이터를 엔티티 형식으로 매핑
   */
  private mapApiDataToEntity(data: any): Partial<HousingSupply> {
    // 날짜 문자열을 Date 객체로 변환하는 헬퍼 함수
    const parseDate = (
      dateStr: string | null | undefined,
    ): Date | undefined => {
      if (!dateStr || dateStr === 'null' || dateStr === '') return undefined;
      try {
        // YYYY-MM-DD 형식
        if (dateStr.length === 10) {
          return new Date(dateStr);
        }
        // YYYYMM 형식 (입주예정월)
        if (dateStr.length === 6) {
          return new Date(
            `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-01`,
          );
        }
        return undefined;
      } catch {
        return undefined;
      }
    };

    return {
      // 기본 정보
      houseManageNo: data.HOUSE_MANAGE_NO || data.houseManageNo,
      pblancNo: data.PBLANC_NO || data.pblancNo,
      houseName: data.HOUSE_NM || data.houseName,
      houseSecd: data.HOUSE_SECD || data.houseSecd,
      houseSecdNm: data.HOUSE_SECD_NM || data.houseSecdNm,
      houseDtlSecd: data.HOUSE_DTL_SECD || data.houseDtlSecd,
      houseDtlSecdNm: data.HOUSE_DTL_SECD_NM || data.houseDtlSecdNm,
      rentSecd: data.RENT_SECD || data.rentSecd,
      rentSecdNm: data.RENT_SECD_NM || data.rentSecdNm,

      // 지역 정보
      subscrptAreaCode: data.SUBSCRPT_AREA_CODE || data.subscrptAreaCode,
      subscrptAreaCodeNm: data.SUBSCRPT_AREA_CODE_NM || data.subscrptAreaCodeNm,
      hssplyZip: data.HSSPLY_ZIP || data.hssplyZip,
      hssplyAdres: data.HSSPLY_ADRES || data.hssplyAdres,

      // 위치 좌표
      latitude:
        data.LATITUDE !== undefined && data.LATITUDE !== null
          ? Number(data.LATITUDE)
          : data.latitude !== undefined && data.latitude !== null
            ? Number(data.latitude)
            : undefined,
      longitude:
        data.LONGITUDE !== undefined && data.LONGITUDE !== null
          ? Number(data.LONGITUDE)
          : data.longitude !== undefined && data.longitude !== null
            ? Number(data.longitude)
            : undefined,

      // 규모 및 일정
      totSuplyHshldco:
        data.TOT_SUPLY_HSHLDCO !== undefined && data.TOT_SUPLY_HSHLDCO !== null
          ? Number(data.TOT_SUPLY_HSHLDCO)
          : undefined,
      rcritPblancDe: parseDate(data.RCRIT_PBLANC_DE || data.rcritPblancDe),
      rceptBgnde: parseDate(
        data.RCEPT_BGNDE ||
          data.rceptBgnde ||
          data.SUBSCRPT_RCEPT_BGNDE ||
          data.subscrptRceptBgnde,
      ),
      rceptEndde: parseDate(
        data.RCEPT_ENDDE ||
          data.rceptEndde ||
          data.SUBSCRPT_RCEPT_ENDDE ||
          data.subscrptRceptEndde,
      ),
      spsplyRceptBgnde: parseDate(
        data.SPSPLY_RCEPT_BGNDE || data.spsplyRceptBgnde,
      ),
      spsplyRceptEndde: parseDate(
        data.SPSPLY_RCEPT_ENDDE || data.spsplyRceptEndde,
      ),
      przwnerPresnatnDe: parseDate(
        data.PRZWNER_PRESNATN_DE || data.przwnerPresnatnDe,
      ),
      cntrctCnclsBgnde: parseDate(
        data.CNTRCT_CNCLS_BGNDE || data.cntrctCnclsBgnde,
      ),
      cntrctCnclsEndde: parseDate(
        data.CNTRCT_CNCLS_ENDDE || data.cntrctCnclsEndde,
      ),
      mvnPrearngeYm: parseDate(data.MVN_PREARNGE_YM || data.mvnPrearngeYm),

      // 연락처 및 URL
      hmpgAdres: data.HMPG_ADRES || data.hmpgAdres,
      pblancUrl: data.PBLANC_URL || data.pblancUrl,
      mdhsTelno: data.MDHS_TELNO || data.mdhsTelno,

      // 사업주체 정보
      cnstrctEntrpsNm: data.CNSTRCT_ENTRPS_NM || data.cnstrctEntrpsNm,
      bsnsMbyNm: data.BSNS_MBY_NM || data.bsnsMbyNm,
      nsprcNm: data.NSPRC_NM || data.nsprcNm,

      // 특성 플래그
      specltRdnEarthAt: data.SPECLT_RDN_EARTH_AT || data.specltRdnEarthAt,
      mdatTrgetAreaSecd: data.MDAT_TRGET_AREA_SECD || data.mdatTrgetAreaSecd,
      parcprcUlsAt: data.PARCPRC_ULS_AT || data.parcprcUlsAt,
      imprmnBsnsAt: data.IMPRMN_BSNS_AT || data.imprmnBsnsAt,
      publicHouseEarthAt: data.PUBLIC_HOUSE_EARTH_AT || data.publicHouseEarthAt,
      lrsclBldlndAt: data.LRSCL_BLDLND_AT || data.lrsclBldlndAt,
      nplnPrvoprPublicHouseAt:
        data.NPLN_PRVOPR_PUBLIC_HOUSE_AT || data.nplnPrvoprPublicHouseAt,
      publicHouseSpclwApplcAt:
        data.PUBLIC_HOUSE_SPCLW_APPLC_AT || data.publicHouseSpclwApplcAt,

      // 순위별 접수일정 (1순위)
      gnrlRnk1CrspareaRcptde: parseDate(
        data.GNRL_RNK1_CRSPAREA_RCPTDE || data.gnrlRnk1CrspareaRcptde,
      ),
      gnrlRnk1CrspareaEndde: parseDate(
        data.GNRL_RNK1_CRSPAREA_ENDDE || data.gnrlRnk1CrspareaEndde,
      ),
      gnrlRnk1EtcGgRcptde: parseDate(
        data.GNRL_RNK1_ETC_GG_RCPTDE || data.gnrlRnk1EtcGgRcptde,
      ),
      gnrlRnk1EtcGgEndde: parseDate(
        data.GNRL_RNK1_ETC_GG_ENDDE || data.gnrlRnk1EtcGgEndde,
      ),
      gnrlRnk1EtcAreaRcptde: parseDate(
        data.GNRL_RNK1_ETC_AREA_RCPTDE || data.gnrlRnk1EtcAreaRcptde,
      ),
      gnrlRnk1EtcAreaEndde: parseDate(
        data.GNRL_RNK1_ETC_AREA_ENDDE || data.gnrlRnk1EtcAreaEndde,
      ),

      // 순위별 접수일정 (2순위)
      gnrlRnk2CrspareaRcptde: parseDate(
        data.GNRL_RNK2_CRSPAREA_RCPTDE || data.gnrlRnk2CrspareaRcptde,
      ),
      gnrlRnk2CrspareaEndde: parseDate(
        data.GNRL_RNK2_CRSPAREA_ENDDE || data.gnrlRnk2CrspareaEndde,
      ),
      gnrlRnk2EtcGgRcptde: parseDate(
        data.GNRL_RNK2_ETC_GG_RCPTDE || data.gnrlRnk2EtcGgRcptde,
      ),
      gnrlRnk2EtcGgEndde: parseDate(
        data.GNRL_RNK2_ETC_GG_ENDDE || data.gnrlRnk2EtcGgEndde,
      ),
      gnrlRnk2EtcAreaRcptde: parseDate(
        data.GNRL_RNK2_ETC_AREA_RCPTDE || data.gnrlRnk2EtcAreaRcptde,
      ),
      gnrlRnk2EtcAreaEndde: parseDate(
        data.GNRL_RNK2_ETC_AREA_ENDDE || data.gnrlRnk2EtcAreaEndde,
      ),
    };
  }

  /**
   * 주소를 좌표로 변환 (지오코딩)
   * 네이버 클라우드 플랫폼 지오코딩 API 사용
   */
  private async geocodeAddress(
    address: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    if (!this.naverClientId || !this.naverClientSecret) {
      this.logger.warn(
        'NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 설정되지 않아 지오코딩을 건너뜁니다.',
      );
      return null;
    }

    if (!address || address.trim() === '') {
      return null;
    }

    try {
      // 네이버 클라우드 플랫폼 지오코딩 API 엔드포인트
      // 문서: https://api.ncloud-docs.com/docs/application-maps-geocoding
      const naverGeocodeUrl =
        'https://maps.apigw.ntruss.com/map-geocode/v2/geocode';
      const params = new URLSearchParams({
        query: address,
      });

      const response = await fetch(`${naverGeocodeUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'x-ncp-apigw-api-key-id': this.naverClientId,
          'x-ncp-apigw-api-key': this.naverClientSecret,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(
          `지오코딩 API 호출 실패: ${response.status} ${response.statusText}`,
        );
        this.logger.warn(`에러 상세: ${errorText}`);
        this.logger.warn(
          `Client ID 존재 여부: ${!!this.naverClientId}, Client Secret 존재 여부: ${!!this.naverClientSecret}`,
        );
        return null;
      }

      const data = await response.json();

      // 네이버 클라우드 플랫폼 API 응답 구조 확인
      if (
        data.addresses &&
        Array.isArray(data.addresses) &&
        data.addresses.length > 0
      ) {
        const firstResult = data.addresses[0];
        const latitude = parseFloat(firstResult.y); // 네이버는 y가 위도
        const longitude = parseFloat(firstResult.x); // 네이버는 x가 경도

        if (!isNaN(latitude) && !isNaN(longitude)) {
          this.logger.log(
            `지오코딩 성공: ${address} -> (${latitude}, ${longitude})`,
          );
          return { latitude, longitude };
        }
      }

      this.logger.warn(`지오코딩 결과 없음: ${address}`);
      return null;
    } catch (error) {
      this.logger.error(
        `지오코딩 실패: ${address} - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return null;
    }
  }
}
