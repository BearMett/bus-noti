import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { OAuthProvider } from '@busnoti/shared';
import type { AuthTokens } from '@busnoti/shared';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientId = config.get<string>('auth.github.clientId');
    const clientSecret = config.get<string>('auth.github.clientSecret');
    const callbackUrl = config.get<string>('auth.github.callbackUrl');

    super({
      clientID: clientId || 'not-configured',
      clientSecret: clientSecret || 'not-configured',
      callbackURL: callbackUrl || 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: Error | null, user?: AuthTokens) => void,
  ): Promise<void> {
    const { id, username, emails, photos } = profile;

    if (!emails || emails.length === 0) {
      done(new Error('No email provided from GitHub'));
      return;
    }

    const user = await this.authService.findOrCreateOAuthUser(
      OAuthProvider.GITHUB,
      {
        id,
        email: emails[0].value,
        name: username,
        avatar: photos?.[0]?.value,
      },
    );

    const tokens: AuthTokens = await this.authService.generateTokens(user);

    this.logger.log(`GitHub OAuth successful for user: ${user.email}`);

    done(null, tokens);
  }
}
