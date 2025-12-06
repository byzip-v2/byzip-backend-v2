import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ApiKeyGuard } from './guards/api-key.guard';
import { SchedulerService } from './scheduler.service';

@ApiTags('Scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Public() // JwtGuard를 건너뛰고 ApiKeyGuard만 실행
  @UseGuards(ApiKeyGuard)
  @Get('public-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '공공데이터 스케줄러 실행',
    description: '공공데이터 포털에서 데이터를 수집하고 저장합니다.',
  })
  @ApiSecurity('api-key')
  @ApiResponse({
    status: 200,
    description: '스케줄러 작업 성공',
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 API 키',
  })
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
