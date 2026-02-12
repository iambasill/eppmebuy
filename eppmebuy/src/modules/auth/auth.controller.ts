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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CreateSupportDto } from './dto/create-support.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
        const config = (req as any).configService || this.authService['configService'];
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

        const config = (req as any).configService || this.authService['configService'];
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
