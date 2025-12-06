import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // 환경 변수에서 API 키 가져오기
    const validApiKey = this.configService.get<string>('SCHEDULER_API_KEY');
    
    if (!validApiKey) {
      // API 키가 설정되지 않은 경우 개발 환경에서는 허용
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      throw new UnauthorizedException('스케줄러 API 키가 설정되지 않았습니다.');
    }

    // X-API-Key 헤더에서 API 키 추출
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API 키가 필요합니다. X-API-Key 헤더를 포함해주세요.');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('유효하지 않은 API 키입니다.');
    }

    return true;
  }
}

