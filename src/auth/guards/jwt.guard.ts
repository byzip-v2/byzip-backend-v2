import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from '../../types/jwt.types';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Public 데코레이터가 있는 엔드포인트는 인증을 건너뜀
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Authorization 헤더에서 토큰 추출
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('토큰이 필요합니다.');
    }

    try {
      // Bearer 토큰 추출
      const token = this.authService.extractTokenFromHeader(
        authorization,
        true,
      );

      // 토큰 검증
      const decodedToken: JwtPayload = this.authService.verifyToken(token);

      // 사용자 정보 조회
      const user = await this.usersService.findByUserId(decodedToken.sub);
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      // 요청 객체에 사용자 정보 추가
      request.user = user;
      return true;
    } catch (error) {
      // 에러 타입에 따른 구체적인 메시지 제공
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // JWT 관련 에러인 경우
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('토큰이 만료되었습니다.');
        }
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('유효하지 않은 토큰 형식입니다.');
        }
      }

      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
