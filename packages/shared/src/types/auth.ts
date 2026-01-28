/**
 * JWT Payload 구조
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * 인증 토큰 응답
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 인증된 사용자 정보
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

/**
 * OAuth 제공자
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
}
