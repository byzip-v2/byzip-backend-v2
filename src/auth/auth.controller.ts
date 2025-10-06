import { Body, Controller, Headers, Post } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import * as authDto from '../types/dto/auth/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('token/access')
  // tokenAccess(@Headers('Authorization') rowToken: string) {
  //   const token = this.authService.extractTokenFromHeader(rowToken, true);
  //   const newToken = this.authService.rotateToken(token, false);
  //   return { accessToken: newToken };
  // }

  // @Post('token/refresh')
  // tokenRefresh(@Headers('Authorization') rowToken: string) {
  //   const token = this.authService.extractTokenFromHeader(rowToken, true);
  //   const newToken = this.authService.rotateToken(token, true);
  //   return { refreshToken: newToken };
  // }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인 성공시 엑세스토큰과  리프레시 토큰을 반환합니다.',
  })
  // @ApiHeader({ name: 'Authorization', description: 'Basic 토큰' })
  @ApiBasicAuth()
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '로그인에 실패하였습니다' })
  login(@Headers('Authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithUserId(credentials);
  }

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: '사용자 ID (로그인용)',
          example: 'user123',
        },
        name: {
          type: 'string',
          description: '사용자 이름',
          example: '홍길동',
        },
        email: {
          type: 'string',
          description: '이메일',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          description: '비밀번호',
          example: 'password123!',
        },
        confirmPassword: {
          type: 'string',
          description: '비밀번호 확인',
          example: 'password123!',
        },
        phoneNumber: {
          type: 'string',
          description: '전화번호 (선택)',
          example: '010-1234-5678',
        },
      },
      required: ['userId', 'name', 'email', 'password', 'confirmPassword'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  register(@Body() user: authDto.RegisterRequestDto) {
    return this.authService.registerUser(user);
  }
}
