import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('app.google.clientId'),
            clientSecret: configService.get<string>('app.google.clientSecret'),
            callbackURL: configService.get<string>('app.google.callbackUrl'),
            scope: ['profile', 'email', 'openid'],
            passReqToCallback: true,
        });
    }

    async validate(
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new UnauthorizedException('No email provided by Google'), null);
            }

            const result = await this.authService.handleGoogleLogin({
                googleId: profile.id,
                email,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
            }, req);

            return done(null, result);
        } catch (error) {
            return done(error, null);
        }
    }
}
