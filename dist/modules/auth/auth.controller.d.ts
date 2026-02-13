import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CreateSupportDto } from './dto/create-support.dto.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { UserService } from '../user/user.service.js';
import { HashingProvider } from './providers/hashing.provider.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginDto } from '../user/dto/login.user.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ConfigService } from '@nestjs/config';
import { forgotPasswordDto } from './dto/forgot.password.dto.js';
import { ResetPasswordDto } from './dto/reset.password.dto.js';
import { OtpService } from '../otp/otp.service.js';
import { verifyAccountDto } from './dto/verify.account.dto.js';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly hashingProvider;
    private readonly eventEmitter;
    private readonly configService;
    private readonly otpService;
    constructor(authService: AuthService, userService: UserService, hashingProvider: HashingProvider, eventEmitter: EventEmitter2, configService: ConfigService, otpService: OtpService);
    register(dto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    login(loginData: LoginDto, headers: Record<string, string>): Promise<{
        message: string;
        status: string;
    } | {
        accessToken: any;
        refreshToken: any;
        message: string;
        status: string;
        userData: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            role: import("../../entities/index.js").UserRole;
            status: import("../../entities/index.js").UserStatus;
            googleId: string;
            facebookId: string;
            emailVerified: boolean;
            profilePictureUrl: string;
            organizationName: string;
            contactEmail: string;
            contactPhone: string;
            createdAt: Date;
            updatedAt: Date;
            following: import("../../entities/user-follow.entity.js").UserFollow[];
            followers: import("../../entities/user-follow.entity.js").UserFollow[];
            paymentMethods: import("../../entities/payment-method.entity.js").PaymentMethod[];
            orders: import("../../entities/order.entity.js").Order[];
            tickets: import("../../entities/ticket.entity.js").Ticket[];
            reviews: import("../../entities/review.entity.js").Review[];
            interactions: import("../../entities/user-interaction.entity.js").UserInteraction[];
            favorites: import("../../entities/favorite.entity.js").Favorite[];
            searchHistory: import("../../entities/search-history.entity.js").SearchHistory[];
            notifications: import("../../entities/notification.entity.js").Notification[];
            payouts: import("../../entities/payout.entity.js").Payout[];
            scannedCheckIns: import("../../entities/check-in.entity.js").CheckIn[];
            hostedEvents: import("../../entities/event.entity.js").Event[];
            supportRequests: import("../../entities/customer-support.entity.js").CustomerSupport[];
            sessions: import("../../entities/user-session.entity.js").UserSession[];
        };
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    forgotPassword(body: forgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyAccount(body: verifyAccountDto): Promise<{
        message: string;
    }>;
    googleAuth(redirectUri: string, prompt: string, req: Request, res: Response): void | Response<any, Record<string, any>>;
    googleSwitchAuth(redirectUri: string, req: Request, res: Response): void | Response<any, Record<string, any>>;
    googleCallback(req: Request, res: Response): void;
    createSupportRequest(req: Request, dto: CreateSupportDto): Promise<{
        status: string;
        message: string;
    }>;
}
