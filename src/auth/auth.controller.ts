import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  DeleteUserRequestDto,
  DeleteUserResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../types/dto/auth/auth.dto';
import { UsersModel } from '../users/entities/users.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인 성공시 엑세스토큰과  리프레시 토큰을 반환합니다.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '로그인에 실패하였습니다' })
  login(@Body() loginData: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.loginWithUserId(loginData);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  register(@Body() user: RegisterRequestDto): Promise<RegisterResponseDto> {
    return this.authService.registerUser(user);
  }

  @Post('delete')
  @ApiOperation({
    summary: '사용자 삭제',
    description: 'userId와 password를 확인한 후 해당 사용자를 삭제합니다.',
  })
  @ApiBody({ type: DeleteUserRequestDto })
  @ApiResponse({
    status: 201,
    description: '사용자 삭제 성공',
    type: DeleteUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 또는 사용자를 찾을 수 없음',
  })
  async deleteUser(
    @Body() deleteData: DeleteUserRequestDto,
  ): Promise<DeleteUserResponseDto> {
    return await this.authService.deleteUser(deleteData);
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description:
      '로그인된 사용자를 로그아웃 처리합니다. 클라이언트는 토큰을 삭제해야 합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiBearerAuth('JWT-auth')
  async logout(@CurrentUser() user: UsersModel): Promise<LogoutResponseDto> {
    return await this.authService.logout(user.userId);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: '토큰 갱신',
    description:
      'Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급받습니다.',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 201,
    description: '토큰 갱신 성공',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않거나 만료된 토큰',
  })
  async refresh(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshAccessToken(body.refreshToken);
  }
}
