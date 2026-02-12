import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Req,
    Res,
    UseGuards,
    HttpStatus,
    BadRequestException,
    HttpCode,
    Headers,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CreateSupportDto } from './dto/create-support.dto.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { UserService } from '../user/user.service.js';
import { HashingProvider } from './providers/hashing.provider.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegistrationEvent } from '../notification/events/user.registration.event.js';
import { PublicRoute } from './decorators/public.decorator.js';
import { LoginDto } from '../user/dto/login.user.dto.js';
import { CreateUserSessionDto } from '../user/dto/user.session.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { forgotPasswordDto } from './dto/forgot.password.dto.js';
import { forgotPasswordEvent } from '../notification/events/forgot.password.event.js';
import { ResetPasswordDto } from './dto/reset.password.dto.js';
import { OtpService } from '../otp/otp.service.js';
import { verifyAccountDto } from './dto/verify.account.dto.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly hashingProvider: HashingProvider,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService,
        private readonly otpService: OtpService,
    ) { }

    @PublicRoute()
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        try {
            dto.password = await this.hashingProvider.createHash(dto.password);
            await this.userService.createUser(dto);

            this.eventEmitter.emit(
                'user.created',
                new UserRegistrationEvent(dto.email, dto.firstName),
            );

            return {
                success: true,
                message: 'User registered successfully. Please check your email for verification token.',
            };
        } catch (error) {
            throw error;
        }
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    public async login(
        @Body() loginData: LoginDto,
        @Headers() headers: Record<string, string>,
    ) {
        const user = await this.userService.getByEmail(loginData.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        if (user.status === 'PENDING') {
            this.eventEmitter.emit(
                'user.created',
                new UserRegistrationEvent(user.email, user.firstName),
            );

            return {
                message: 'Account not verified. Please check your email.',
                status: 'PENDING',
            };
        }

        if (user.status !== 'ACTIVE') {
            throw new UnauthorizedException('Account is not active');
        }

        const valid = await this.hashingProvider.comparePassword(
            loginData.password,
            user.password,
        );

        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.authService.generateAuthToken(user.id);

        const session: CreateUserSessionDto = {
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

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    public async refreshToken(@Body() dto: RefreshTokenDto) {
        try {
            const secret = this.configService.get<string>('app.jwt.resetSecret');
            const payload = jwt.verify(dto.refreshToken, secret) as any;

            const user = await this.userService.findByEmail(payload.email);
            if (!user) throw new UnauthorizedException('User not found');

            const tokens = await this.authService.generateAuthToken(user.id);

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    public async forgotPassword(@Body() body: forgotPasswordDto) {
        const user = await this.userService.getByEmail(body.email);
        if (!user) throw new BadRequestException('User not found');

        this.eventEmitter.emit(
            'forgot.password',
            new forgotPasswordEvent(user.email, user.firstName),
        );

        return {
            message: 'Password reset token sent to your email',
        };
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    public async resetPassword(@Body() body: ResetPasswordDto) {
        await this.otpService.verifyOtpCode(body.email, body.token);
        const hashedPassword = await this.hashingProvider.createHash(
            body.newPassword,
        );

        await this.userService.changePassword(body.email, hashedPassword);

        return {
            message: 'Password reset successfully',
        };
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('verify-account')
    public async verifyAccount(@Body() body: verifyAccountDto) {
        await this.authService.verifyAccount(body.email, body.token);
        await this.userService.activate(body.email);
        return {
            message: 'Account verified successfully',
        };
    }

    /**
     * GET /auth/google
     * Initiates Google OAuth flow
     */
    @Get('google')
    googleAuth(
        @Query('redirectUri') redirectUri: string,
        @Query('prompt') prompt: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!redirectUri) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'redirectUri query parameter is required',
            });
        }

        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        const config = this.configService;
        authUrl.searchParams.set('client_id', config.get('app.google.clientId'));
        authUrl.searchParams.set('redirect_uri', config.get('app.google.callbackUrl'));
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'profile email openid');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', prompt || 'consent');
        authUrl.searchParams.set('state', redirectUri);

        return res.redirect(authUrl.toString());
    }

    /**
     * GET /auth/google/switch
     * Initiates Google OAuth with account selection
     */
    @Get('google/switch')
    googleSwitchAuth(
        @Query('redirectUri') redirectUri: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!redirectUri) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'redirectUri query parameter is required',
            });
        }

        const config = this.configService;
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

    /**
     * GET /auth/google/callback
     * Google OAuth callback handler
     */
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleCallback(@Req() req: Request, @Res() res: Response) {
        try {
            const user = (req as any).user;
            if (!user) {
                const redirectUri =
                    (req.query.state as string) || 'http://localhost:3000';
                return res.redirect(`${redirectUri}?error=no_user_data`);
            }

            const { userData, accessToken, refreshToken } = user;

            if (!accessToken || !userData) {
                const redirectUri =
                    (req.query.state as string) || 'http://localhost:3000';
                return res.redirect(`${redirectUri}?error=missing_auth_data`);
            }

            const redirectUri =
                (req.query.state as string) || 'http://localhost:3000';

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
        } catch (error: any) {
            const redirectUri =
                (req.query.state as string) || 'http://localhost:3000';
            return res.redirect(
                `${redirectUri}?error=${encodeURIComponent(error.message || 'processing_error')}`,
            );
        }
    }

    /**
     * POST /auth/support
     * Submit a customer support request
     */
    @Post('support')
    @UseGuards(JwtAuthGuard)
    async createSupportRequest(
        @Req() req: Request,
        @Body() dto: CreateSupportDto,
    ) {
        const user = (req as any).user;
        await this.authService.createSupportRequest(user.id, dto);

        return {
            status: 'success',
            message: 'Support request submitted successfully',
        };
    }
}
