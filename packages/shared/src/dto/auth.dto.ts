import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * 회원가입 요청 DTO
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

/**
 * 로그인 요청 DTO
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

/**
 * 토큰 갱신 요청 DTO
 */
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
