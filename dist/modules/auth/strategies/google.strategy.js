"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const auth_service_js_1 = require("../auth.service.js");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    authService;
    constructor(configService, authService) {
        super({
            clientID: configService.get('app.google.clientId'),
            clientSecret: configService.get('app.google.clientSecret'),
            callbackURL: configService.get('app.google.callbackUrl'),
            scope: ['profile', 'email', 'openid'],
            passReqToCallback: true,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new common_1.UnauthorizedException('No email provided by Google'), null);
            }
            const result = await this.authService.handleGoogleLogin({
                googleId: profile.id,
                email,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
            }, req);
            return done(null, result);
        }
        catch (error) {
            return done(error, null);
        }
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_js_1.AuthService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map