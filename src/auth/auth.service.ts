import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  DeleteUserRequestDto,
  DeleteUserResponseDto,
  LoginResponseDto,
  LogoutDataDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  TokenDataDto,
} from '../types/dto/auth/auth.dto';
import { JwtPayload } from '../types/jwt.types';
import { UsersModel } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  //  1) 사용자가 로그인 or 회원가입을 하면 엑세스 토큰과 리프레시 토큰을 발급받음
  //  2) 로그인할때 Basic 토큰과 함께 요청을 보낸다.
  //  3) 아무나 접근 할 수 없는 정보를 접근 할때는 엑세스토큰을 헤더에 추가해서보낸다.
  //  4) 토큰 요청과 함께 받는 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.

  // 로그인에 필요한 엑세스토큰과 리프레시토큰을 생성하는 로직
  signToken(user: Pick<UsersModel, 'userId'>, isRefreshToken: boolean) {
    const payload = {
      sub: user.userId,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT_SECRET is not configured');
    }

    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      // Access Token: 1시간, Refresh Token: 30일
      expiresIn: isRefreshToken ? '30d' : '1h',
    });
  }

  // 엑세스토큰과 리프레시토큰을 반환하는 로직
  async loginUser(user: Pick<UsersModel, 'userId'>): Promise<LoginResponseDto> {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    // Refresh Token을 DB에 저장
    const expiresAt = new Date();
    // 테스트용: 10분 후 expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    // 프로덕션: 30일 후 - expiresAt.setDate(expiresAt.getDate() + 30);
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.refreshTokenRepository.save({
      userId: user.userId,
      token: refreshToken,
      expiresAt,
    });

    const tokenData: TokenDataDto = { accessToken, refreshToken };
    return {
      success: true,
      message: '로그인이 성공적으로 처리되었습니다.',
      data: tokenData,
    };
  }

  async authenticateWithUserIdAndPassword(
    user: Pick<UsersModel, 'userId' | 'password'>,
  ): Promise<Pick<UsersModel, 'userId' | 'password'>> {
    // 1. 아이디로 사용자 조회
    // 2. 비밀번호 확인
    // 3. 사용자 정보 반환

    const existingUser = await this.usersService.findByUserId(user.userId);
    if (!existingUser) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    //  파라미터
    //  1) 입력된 비밀번호
    //  2) 기존해시 -> 사용자 정보에 저장된 해시

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  async loginWithUserId(
    user: Pick<UsersModel, 'userId' | 'password'>,
  ): Promise<LoginResponseDto> {
    const existingUser = await this.authenticateWithUserIdAndPassword(user);
    return this.loginUser(existingUser);
  }

  async registerUser(user: RegisterRequestDto): Promise<RegisterResponseDto> {
    // 입력 데이터 유효성 검사
    if (!user.password || typeof user.password !== 'string') {
      throw new UnauthorizedException('유효한 비밀번호를 입력해주세요.');
    }

    // 기존 사용자 존재 여부 확인
    const existingUser = await this.usersService.findByUserId(user.userId);
    if (existingUser) {
      throw new UnauthorizedException('이미 존재하는 아이디입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 새 사용자 생성
    const newUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });

    // 회원가입 성공 후 토큰 발급 및 저장
    const accessToken = this.signToken({ userId: newUser.userId }, false);
    const refreshToken = this.signToken({ userId: newUser.userId }, true);

    // Refresh Token을 DB에 저장
    const expiresAt = new Date();
    // 테스트용: 10분 후
    // 프로덕션: 30일 후 - expiresAt.setDate(expiresAt.getDate() + 30);
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.refreshTokenRepository.save({
      userId: newUser.userId,
      token: refreshToken,
      expiresAt,
    });

    const tokenData: TokenDataDto = { accessToken, refreshToken };
    return {
      success: true,
      message: '회원가입이 성공적으로 처리되었습니다.',
      data: tokenData,
    };
  }

  async deleteUser(
    deleteData: DeleteUserRequestDto,
  ): Promise<DeleteUserResponseDto> {
    // 1. 사용자 인증 (userId와 password 확인)
    await this.authenticateWithUserIdAndPassword(deleteData);

    // 2. 사용자 삭제
    const isDeleted = await this.usersService.removeByUserId(deleteData.userId);

    if (!isDeleted) {
      throw new UnauthorizedException('사용자 삭제에 실패했습니다.');
    }

    // 3. 성공 응답 반환
    return {
      success: true,
      message: '사용자가 성공적으로 삭제되었습니다.',
      data: { userId: deleteData.userId },
    };
  }

  extractTokenFromHeader(header: string, isBearer: boolean): string {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    } else {
      const token = splitToken[1];
      return token;
    }
  }

  private isValidJwtPayload(payload: unknown): payload is JwtPayload {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }

    const obj = payload as Record<string, unknown>;
    return (
      'sub' in obj &&
      'type' in obj &&
      typeof obj.sub === 'string' &&
      (obj.type === 'access' || obj.type === 'refresh')
    );
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decodedToken: unknown = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (this.isValidJwtPayload(decodedToken)) {
        return decodedToken;
      }

      throw new UnauthorizedException('유효하지 않은 토큰 형식입니다.');
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decodedToken = this.verifyToken(token);
    return this.signToken({ userId: decodedToken.sub }, isRefreshToken);
  }

  async logout(userId: string): Promise<LogoutResponseDto> {
    // DB에서 해당 사용자의 모든 Refresh Token 삭제
    await this.refreshTokenRepository.delete({ userId });

    const data: LogoutDataDto = {
      userId,
      logoutAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: '로그아웃이 성공적으로 처리되었습니다.',
      data,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponseDto> {
    try {
      // 1. Refresh Token 검증
      const decoded = this.verifyToken(refreshToken);

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('유효하지 않은 토큰 타입입니다.');
      }

      // 2. DB에서 Refresh Token 확인
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { userId: decoded.sub, token: refreshToken },
      });

      if (!storedToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
      }

      // 3. 만료 시간 확인
      if (new Date(storedToken.expiresAt) < new Date()) {
        // 만료된 토큰 삭제
        await this.refreshTokenRepository.delete({ id: storedToken.id });
        throw new UnauthorizedException('만료된 리프레시 토큰입니다.');
      }

      // 4. 새로운 Access Token 생성
      const newAccessToken = this.signToken({ userId: decoded.sub }, false);

      // 5. 새로운 Refresh Token 생성 (선택적 - Refresh Token Rotation)
      const newRefreshToken = this.signToken({ userId: decoded.sub }, true);

      // 6. 새로운 Refresh Token을 DB에 저장하고 기존 토큰 삭제
      const expiresAt = new Date();
      // 테스트용: 10분 후 expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      // 프로덕션: 30일 후 - expiresAt.setDate(expiresAt.getDate() + 30);
      expiresAt.setDate(expiresAt.getDate() + 30);

      await this.refreshTokenRepository.delete({ id: storedToken.id });
      await this.refreshTokenRepository.save({
        userId: decoded.sub,
        token: newRefreshToken,
        expiresAt,
      });

      const tokenData: TokenDataDto = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      return {
        success: true,
        message: '토큰이 성공적으로 갱신되었습니다.',
        data: tokenData,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('토큰 갱신에 실패했습니다.');
    }
  }
}
