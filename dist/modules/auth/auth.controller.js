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
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    googleAuth(redirectUri, prompt, req, res) {
        if (!redirectUri) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'redirectUri query parameter is required',
            });
        }
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        const config = req.configService || this.authService['configService'];
        authUrl.searchParams.set('client_id', config.get('app.google.clientId'));
        authUrl.searchParams.set('redirect_uri', config.get('app.google.callbackUrl'));
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
        const config = req.configService || this.authService['configService'];
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', config.get('app.google.clientId'));
        authUrl.searchParams.set('redirect_uri', config.get('app.google.callbackUrl'));
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
    __metadata("design:paramtypes", [auth_service_js_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map