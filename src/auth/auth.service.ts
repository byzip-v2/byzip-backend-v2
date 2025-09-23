import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from 'src/types/dto/auth/auth.dto';
import { JwtPayload } from 'src/types/jwt.types';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
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
      expiresIn: isRefreshToken ? '365d' : '365d',
    });
  }

  // 엑세스토큰과 리프레시토큰을 반환하는 로직
  loginUser(user: Pick<UsersModel, 'userId'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);
    return { accessToken, refreshToken };
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

  async loginWithUserId(user: Pick<UsersModel, 'userId' | 'password'>) {
    const existingUser = await this.authenticateWithUserIdAndPassword(user);
    return this.loginUser(existingUser);
  }

  async registerUser(user: RegisterRequestDto) {
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

    // 로그인 토큰 반환
    return this.loginUser({ userId: newUser.userId });
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

  decodeBasicToken(base64String: string): { userId: string; password: string } {
    const decodedToken = Buffer.from(base64String, 'base64').toString('utf-8');
    const [userId, password] = decodedToken.split(':');
    if (!userId || !password) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    return { userId, password };
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
}
