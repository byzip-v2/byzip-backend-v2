import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersModel } from './entities/users.entity';
import { UsersService } from './users.service';
import { UsersModelDto } from 'src/types/dto/user/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: '로그인한 유저 정보 조회',
    description: '로그인한 유저 정보를 조회합니다.',
  })
  @ApiHeader({ name: 'Authorization', description: 'Bearer 토큰' })
  @UseGuards(JwtGuard)
  async getMyProfile(
    @CurrentUser() user: UsersModel,
  ): Promise<Omit<UsersModel, 'password'>> {
    try {
      const profile = await this.usersService.getMyProfile(user.userId);
      if (!profile) {
        throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
      }
      return profile;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('사용자 프로필을 찾을 수 없습니다.');
    }
  }

  @Get()
  @ApiOperation({
    summary: '유저 정보 조회',
    description: '유저 정보를 조회합니다.',
  })
  async findAll(): Promise<UsersModel[]> {
    return await this.usersService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<UsersModel | null> {
  //   return await this.usersService.findOne(id);
  // }

  // @Get('userId/:userId')
  // async findByUserId(
  //   @Param('userId') userId: string,
  // ): Promise<UsersModel | null> {
  //   return await this.usersService.findByUserId(userId);
  // }

  @Patch(':id')
  @ApiOperation({
    summary: '유저 정보 수정',
    description: '유저 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '유저 고유 ID' })
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<UsersModelDto>,
  ): Promise<UsersModel | null> {
    return await this.usersService.update(id, userData);
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async remove(@Param('id') id: number): Promise<void> {
  //   return await this.usersService.remove(id);
  // }
}
