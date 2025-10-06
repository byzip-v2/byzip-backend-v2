import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  DeleteUserRequestDto,
  DeleteUserResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../types/dto/auth/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (await this.authService.deleteUser(
      deleteData,
    )) as DeleteUserResponseDto;
  }
}
