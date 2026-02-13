import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity.js';
import { UserStatus } from '../../entities/enums/index.js';
import { CustomerSupport } from '../../entities/customer-support.entity.js';
import { UserSession } from '../../entities/user-session.entity.js';
import { OtpService } from '../otp/otp.service.js';
import { CreateUserSessionDto } from '../user/dto/user.session.dto.js';
export declare class AuthService {
    private readonly configService;
    private readonly userRepository;
    private readonly supportRepository;
    private readonly sessionRepository;
    private readonly otpService;
    private readonly logger;
    constructor(configService: ConfigService, userRepository: Repository<User>, supportRepository: Repository<CustomerSupport>, sessionRepository: Repository<UserSession>, otpService: OtpService);
    handleGoogleLogin(profile: {
        googleId: string;
        email: string;
        firstName: string;
        lastName: string;
    }, req: any): Promise<{
        accessToken: any;
        refreshToken: any;
        userData: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phoneNumber: string;
            role: import("../../entities/enums/index.js").UserRole;
            status: UserStatus;
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
            supportRequests: CustomerSupport[];
            sessions: UserSession[];
            id: string;
        };
    }>;
    generateAuthToken(userId: string): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    createSupportRequest(userId: string, data: Partial<CustomerSupport>): Promise<CustomerSupport>;
    newSession(session: CreateUserSessionDto): Promise<void>;
    verifyAccount(email: string, token: string): Promise<void>;
}
