import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from './guards/api-key.guard';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @UseGuards(ApiKeyGuard)
  @Get('public-data')
  @HttpCode(HttpStatus.OK)
  async triggerScheduler(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
    results?: Array<{
      serviceName: string;
      success: boolean;
      savedCount: number;
      geocodingFailedCount: number;
      error?: string;
    }>;
  }> {
    const result = await this.schedulerService.runAllScheduledTasks();

    return {
      success: result.success,
      message: result.success
        ? '스케줄러 작업이 성공적으로 완료되었습니다'
        : '스케줄러 작업 중 일부 실패가 발생했습니다',
      timestamp: new Date().toISOString(),
      results: result.results,
    };
  }
}
