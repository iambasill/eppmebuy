"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_js_1 = require("./auth.service.js");
const jwt_auth_guard_js_1 = require("./guards/jwt-auth.guard.js");
const create_support_dto_js_1 = require("./dto/create-support.dto.js");
const create_user_dto_js_1 = require("../user/dto/create-user.dto.js");
const user_service_js_1 = require("../user/user.service.js");
const hashing_provider_js_1 = require("./providers/hashing.provider.js");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_registration_event_js_1 = require("../notification/events/user.registration.event.js");
const public_decorator_js_1 = require("./decorators/public.decorator.js");
const login_user_dto_js_1 = require("../user/dto/login.user.dto.js");
const refresh_token_dto_js_1 = require("./dto/refresh-token.dto.js");
const config_1 = require("@nestjs/config");
const jwt = __importStar(require("jsonwebtoken"));
const forgot_password_dto_js_1 = require("./dto/forgot.password.dto.js");
const forgot_password_event_js_1 = require("../notification/events/forgot.password.event.js");
const reset_password_dto_js_1 = require("./dto/reset.password.dto.js");
const otp_service_js_1 = require("../otp/otp.service.js");
const verify_account_dto_js_1 = require("./dto/verify.account.dto.js");
let AuthController = class AuthController {
    authService;
    userService;
    hashingProvider;
    eventEmitter;
    configService;
    otpService;
    constructor(authService, userService, hashingProvider, eventEmitter, configService, otpService) {
        this.authService = authService;
        this.userService = userService;
        this.hashingProvider = hashingProvider;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.otpService = otpService;
    }
    async register(dto) {
        try {
            dto.password = await this.hashingProvider.createHash(dto.password);
            await this.userService.createUser(dto);
            this.eventEmitter.emit('user.created', new user_registration_event_js_1.UserRegistrationEvent(dto.email, dto.firstName));
            return {
                success: true,
                message: 'User registered successfully. Please check your email for verification token.',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async login(loginData, headers) {
        const user = await this.userService.getByEmail(loginData.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.status === 'PENDING') {
            this.eventEmitter.emit('user.created', new user_registration_event_js_1.UserRegistrationEvent(user.email, user.firstName));
            return {
                message: 'Account not verified. Please check your email.',
                status: 'PENDING',
            };
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        const valid = await this.hashingProvider.comparePassword(loginData.password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.authService.generateAuthToken(user.id);
        const session = {
            user: user,
            ipAddress: headers['x-forwarded-for'] || headers['host'] || 'unknown',
            device: headers['user-agent'],
        };
        await this.authService.newSession(session);
        const { password, ...userData } = user;
        return {
            message: 'Login successful',
            status: 'ACTIVE',
            userData,
            ...tokens,
        };
    }
    async refreshToken(dto) {
        try {
            const secret = this.configService.get('app.jwt.resetSecret');
            const payload = jwt.verify(dto.refreshToken, secret);
            const user = await this.userService.findByEmail(payload.email);
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const tokens = await this.authService.generateAuthToken(user.id);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async forgotPassword(body) {
        const user = await this.userService.getByEmail(body.email);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        this.eventEmitter.emit('forgot.password', new forgot_password_event_js_1.forgotPasswordEvent(user.email, user.firstName));
        return {
            message: 'Password reset token sent to your email',
        };
    }
    async resetPassword(body) {
        await this.otpService.verifyOtpCode(body.email, body.token);
        const hashedPassword = await this.hashingProvider.createHash(body.newPassword);
        await this.userService.changePassword(body.email, hashedPassword);
        return {
            message: 'Password reset successfully',
        };
    }
    async verifyAccount(body) {
        await this.authService.verifyAccount(body.email, body.token);
        await this.userService.activate(body.email);
        return {
            message: 'Account verified successfully',
        };
    }
    googleAuth(redirectUri, prompt, req, res) {
        if (!redirectUri) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'redirectUri query parameter is required',
            });
        }
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        const config = this.configService;
        authUrl.searchParams.set('client_id', config.get('app.google.clientId') || '');
        authUrl.searchParams.set('redirect_uri', config.get('app.google.callbackUrl') || '');
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'profile email openid');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', prompt || 'consent');
        authUrl.searchParams.set('state', redirectUri);
        return res.redirect(authUrl.toString());
    }
    googleSwitchAuth(redirectUri, req, res) {
        if (!redirectUri) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'redirectUri query parameter is required',
            });
        }
        const config = this.configService;
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', config.get('app.google.clientId') || '');
        authUrl.searchParams.set('redirect_uri', config.get('app.google.callbackUrl') || '');
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'profile email openid');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'select_account');
        authUrl.searchParams.set('state', redirectUri);
        return res.redirect(authUrl.toString());
    }
    googleCallback(req, res) {
        try {
            const user = req.user;
            if (!user) {
                const redirectUri = req.query.state || 'http://localhost:3000';
                return res.redirect(`${redirectUri}?error=no_user_data`);
            }
            const { userData, accessToken, refreshToken } = user;
            if (!accessToken || !userData) {
                const redirectUri = req.query.state || 'http://localhost:3000';
                return res.redirect(`${redirectUri}?error=missing_auth_data`);
            }
            const redirectUri = req.query.state || 'http://localhost:3000';
            const params = new URLSearchParams({
                accessToken,
                userId: userData?.id || '',
                email: userData?.email || '',
                firstName: userData?.firstName || '',
                lastName: userData?.lastName || '',
                role: userData?.role || 'ATTENDEE',
            });
            if (refreshToken) {
                params.append('refreshToken', refreshToken);
            }
            return res.redirect(`${redirectUri}?${params.toString()}`);
        }
        catch (error) {
            const redirectUri = req.query.state || 'http://localhost:3000';
            return res.redirect(`${redirectUri}?error=${encodeURIComponent(error.message || 'processing_error')}`);
        }
    }
    async createSupportRequest(req, dto) {
        const user = req.user;
        await this.authService.createSupportRequest(user.id, dto);
        return {
            status: 'success',
            message: 'Support request submitted successfully',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_js_1.PublicRoute)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_js_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_js_1.PublicRoute)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_js_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_js_1.PublicRoute)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_js_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, public_decorator_js_1.PublicRoute)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_js_1.forgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_js_1.PublicRoute)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_js_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_js_1.PublicRoute)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('verify-account'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_account_dto_js_1.verifyAccountDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyAccount", null);
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Query)('redirectUri')),
    __param(1, (0, common_1.Query)('prompt')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/switch'),
    __param(0, (0, common_1.Query)('redirectUri')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleSwitchAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Post)('support'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_support_dto_js_1.CreateSupportDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createSupportRequest", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_js_1.AuthService,
        user_service_js_1.UserService,
        hashing_provider_js_1.HashingProvider,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService,
        otp_service_js_1.OtpService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map