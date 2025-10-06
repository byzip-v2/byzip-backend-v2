import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RegisterRequestDto } from '../types/dto/auth/auth.dto';
import type { UsersModelDto } from '../types/dto/user/user.dto';
import { UsersModel } from './entities/users.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async create(userData: RegisterRequestDto): Promise<UsersModel> {
    // 필수 필드 유효성 검사
    if (!userData.userId || userData.userId.trim() === '') {
      throw new BadRequestException('아이디를 입력해주세요.');
    }
    if (!userData.password || userData.password.trim() === '') {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    if (!userData.name || userData.name.trim() === '') {
      throw new BadRequestException('이름을 입력해주세요.');
    }
    if (!userData.email || userData.email.trim() === '') {
      throw new BadRequestException('이메일을 입력해주세요.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new BadRequestException('올바른 이메일 형식을 입력해주세요.');
    }

    // 기존 사용자 존재 여부 확인
    const existingUser = await this.usersRepository.exists({
      where: { userId: userData.userId },
    });
    if (existingUser) {
      throw new UnauthorizedException('이미 존재하는 아이디입니다.');
    }

    const newUser = this.usersRepository.create(userData);

    return await this.usersRepository.save(newUser);
  }

  // 인증용 (비밀번호 포함 조회)
  async findByEmailWithPassword(email: string): Promise<UsersModel | null> {
    return await this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'userId',
        'name',
        'email',
        'password',
        'status',
        'emailVerified',
      ],
    });
  }
  async findOne(id: number): Promise<UsersModel | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<UsersModel | null> {
    return await this.usersRepository.findOne({ where: { userId } });
  }

  async findAll(): Promise<UsersModel[]> {
    return await this.usersRepository.find();
  }

  async update(
    id: number,
    userData: Partial<UsersModelDto>,
  ): Promise<UsersModel | null> {
    this.logger.log(
      `업데이트 시도: ID=${id}, 데이터=${JSON.stringify(userData)}`,
    );

    // 먼저 사용자가 존재하는지 확인
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      this.logger.warn(`사용자를 찾을 수 없음: ID=${id}`);
      return null;
    }

    this.logger.log(`기존 사용자 발견: ${JSON.stringify(existingUser)}`);

    // 업데이트 실행
    const result = await this.usersRepository.update(id, userData);
    this.logger.log(`업데이트 결과: affected=${result.affected}`);

    // 업데이트가 실제로 실행되었는지 확인
    if (result.affected === 0) {
      this.logger.warn(`업데이트 실패: 영향받은 행이 0개`);
      return null;
    }

    // 업데이트된 사용자 정보 반환
    const updatedUser = await this.findOne(id);
    this.logger.log(`업데이트 후 사용자: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeByUserId(userId: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ userId });
    return (result.affected ?? 0) > 0;
  }

  // 현재 사용자 프로필 조회 (비밀번호 제외)
  async getMyProfile(
    userId: string,
  ): Promise<Omit<UsersModel, 'password'> | null> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: [
        'id',
        'userId',
        'name',
        'email',
        'phoneNumber',
        'profileImageUrl',
        'birthDate',
        'gender',
        'createdAt',
        'updatedAt',
        'status',
        'role',
        'emailVerified',
        'phoneVerified',
      ],
    });

    return user as Omit<UsersModel, 'password'> | null;
  }
}
