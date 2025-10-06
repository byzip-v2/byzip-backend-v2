import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  GetAllUsersResponseDto,
  GetMeResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '../types/dto/user/user.dto';
import { UsersModel } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: '로그인한 유저 정보 조회',
    description: '로그인한 유저 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 조회 성공',
    type: GetMeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiResponse({
    status: 404,
    description: '사용자 프로필을 찾을 수 없음',
  })
  @ApiBearerAuth('JWT-auth')
  async getMyProfile(
    @CurrentUser() user: UsersModel,
  ): Promise<GetMeResponseDto> {
    try {
      const profile = await this.usersService.getMyProfile(user.userId);
      if (!profile) {
        throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
      }
      return profile as GetMeResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
    }
  }

  @Get()
  @ApiOperation({
    summary: '전체 유저 정보 조회',
    description: '모든 유저의 기본 정보를 조회합니다. (비밀번호 제외)',
  })
  @ApiResponse({
    status: 200,
    description: '유저 목록 조회 성공',
    type: [GetAllUsersResponseDto],
  })
  async findAll(): Promise<GetAllUsersResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => ({
      id: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
      status: user.status,
      role: user.role,
      emailVerified: user.emailVerified,
    }));
  }

  @Patch(':id')
  @ApiOperation({
    summary: '유저 정보 수정',
    description: '특정 유저의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '유저 고유 ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: '유저 정보 수정 성공',
    type: UpdateUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '유저를 찾을 수 없음',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  async update(
    @Param('id') id: number,
    @Body() userData: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const updatedUser = await this.usersService.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    return updatedUser as UpdateUserResponseDto;
  }
}
