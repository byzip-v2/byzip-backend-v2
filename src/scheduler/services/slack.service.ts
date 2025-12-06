import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private readonly webhookUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>('SLACK_WEBHOOK_URL');
  }

  /**
   * 스케줄러 실행 결과를 슬랙에 전송
   */
  async sendSchedulerResult(
    results: Array<{
      serviceName: string;
      success: boolean;
      savedCount: number;
      geocodingFailedCount: number;
      error?: string;
    }>,
  ): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn(
        'SLACK_WEBHOOK_URL이 설정되지 않아 슬랙 알림을 건너뜁니다.',
      );
      return;
    }

    try {
      const allSuccess = results.every((r) => r.success);
      const totalSaved = results.reduce((sum, r) => sum + r.savedCount, 0);
      const totalGeocodingFailed = results.reduce(
        (sum, r) => sum + r.geocodingFailedCount,
        0,
      );

      // 슬랙 메시지 포맷
      const blocks: any[] = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: allSuccess
              ? '✅ 스케줄러 실행 완료'
              : '⚠️ 스케줄러 실행 중 오류 발생',
            emoji: true,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*총 저장된 데이터:*\n${totalSaved}건`,
            },
            {
              type: 'mrkdwn',
              text: `*좌표 변환 실패:*\n${totalGeocodingFailed}건`,
            },
          ],
        },
      ];

      // 각 서비스별 상세 정보 추가
      for (const result of results) {
        blocks.push({
          type: 'divider',
        });

        const statusEmoji = result.success ? '✅' : '❌';
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${statusEmoji} *${result.serviceName}*\n• 업데이트된 데이터: ${result.savedCount}건\n• 좌표를 찾지 못한 데이터: ${result.geocodingFailedCount}건${
              result.error ? `\n• 오류: ${result.error}` : ''
            }`,
          },
        });
      }

      blocks.push({
        type: 'divider',
      });

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<https://byzip-frontend-v2-git-dev-heereals-projects.vercel.app/admin/geo|📍 지오코딩 관리 페이지로 이동>`,
        },
      });

      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `실행 시간: ${new Date().toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
            })}`,
          },
        ],
      });

      const payload = {
        blocks,
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Slack API 호출 실패: ${response.status} ${response.statusText}`,
        );
      }

      this.logger.log('슬랙 알림 전송 성공');
    } catch (error) {
      this.logger.error(
        `슬랙 알림 전송 실패: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // 슬랙 알림 실패해도 스케줄러는 계속 진행
    }
  }
}
