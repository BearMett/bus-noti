import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { OAuthProvider } from '@busnoti/shared';
import type { AuthTokens } from '@busnoti/shared';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientId = config.get<string>('auth.google.clientId');
    const clientSecret = config.get<string>('auth.google.clientSecret');
    const callbackUrl = config.get<string>('auth.google.callbackUrl');

    super({
      clientID: clientId || 'not-configured',
      clientSecret: clientSecret || 'not-configured',
      callbackURL: callbackUrl || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, emails, displayName, photos } = profile;

    if (!emails || emails.length === 0) {
      done(new Error('No email provided from Google'), undefined);
      return;
    }

    const user = await this.authService.findOrCreateOAuthUser(
      OAuthProvider.GOOGLE,
      {
        id,
        email: emails[0].value,
        name: displayName,
        avatar: photos?.[0]?.value,
      },
    );

    const tokens: AuthTokens = await this.authService.generateTokens(user);

    this.logger.log(`Google OAuth successful for user: ${user.email}`);

    done(null, tokens);
  }
}
