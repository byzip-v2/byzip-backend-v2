export interface JwtPayload {
  /** 사용자 ID (subject) */
  sub: string;
  /** 토큰 타입 */
  type: 'access' | 'refresh';
  /** 토큰 발급 시간 (issued at) */
  iat?: number;
  /** 토큰 만료 시간 (expiration time) */
  exp?: number;
}

// GitHub Actions 테스트
