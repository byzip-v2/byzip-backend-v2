import { Injectable, Logger } from '@nestjs/common';
import { PublicDataService } from './services/public-data.service';
import { SlackService } from './services/slack.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly publicDataService: PublicDataService,
    private readonly slackService: SlackService,
  ) {}

  /**
   * 모든 공공데이터 API를 순차적으로 호출
   * 추후 여러 API 추가 시 여기서 오케스트레이션
   */
  async runAllScheduledTasks(): Promise<{
    success: boolean;
    results: Array<{
      serviceName: string;
      success: boolean;
      savedCount: number;
      geocodingFailedCount: number;
      error?: string;
    }>;
  }> {
    this.logger.log('스케줄러 작업 시작');

    const results: Array<{
      serviceName: string;
      success: boolean;
      savedCount: number;
      geocodingFailedCount: number;
      error?: string;
    }> = [];

    try {
      // 1. APT 분양정보 조회
      const housingSupplyResult =
        await this.publicDataService.fetchAndSaveHousingSupply();
      results.push({
        serviceName: 'APT 분양정보',
        success: housingSupplyResult.success,
        savedCount: housingSupplyResult.savedCount,
        geocodingFailedCount: housingSupplyResult.geocodingFailedCount,
        error: housingSupplyResult.error,
      });

      // TODO: 추후 다른 공공데이터 API 추가
      // 2. 다른 API 호출
      // 3. 다른 API 호출
      // ...

      const allSuccess = results.every((r) => r.success);
      const totalSaved = results.reduce((sum, r) => sum + r.savedCount, 0);
      const totalGeocodingFailed = results.reduce(
        (sum, r) => sum + r.geocodingFailedCount,
        0,
      );

      this.logger.log(
        `스케줄러 작업 완료: 성공=${allSuccess}, 총 저장=${totalSaved}건, 지오코딩 실패=${totalGeocodingFailed}건`,
      );

      // 슬랙 알림 전송
      await this.slackService.sendSchedulerResult(results);

      return {
        success: allSuccess,
        results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`스케줄러 작업 실패: ${errorMessage}`, errorStack);

      // 실패한 경우에도 슬랙 알림 전송
      if (results.length > 0) {
        await this.slackService.sendSchedulerResult(results);
      }

      return {
        success: false,
        results,
      };
    }
  }
}
