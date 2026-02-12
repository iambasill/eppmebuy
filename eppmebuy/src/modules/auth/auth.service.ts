import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../../entities/user.entity.js';
import { UserStatus } from '../../entities/enums/index.js';
import { CustomerSupport } from '../../entities/customer-support.entity.js';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(CustomerSupport)
        private readonly supportRepository: Repository<CustomerSupport>,
    ) { }

    async handleGoogleLogin(
        profile: {
            googleId: string;
            email: string;
            firstName: string;
            lastName: string;
        },
        req: any,
    ) {
        // Find user by googleId or email
        let user = await this.userRepository.findOne({
            where: [
                { googleId: profile.googleId },
                { email: profile.email },
            ],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                status: true,
                googleId: true,
            },
        });

        if (user && !user.googleId) {
            // Link Google to existing account
            user = await this.userRepository.save({
                ...user,
                googleId: profile.googleId,
                emailVerified: true,
            });
        } else if (!user) {
            // Create new user
            user = await this.userRepository.save(
                this.userRepository.create({
                    googleId: profile.googleId,
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    status: UserStatus.ACTIVE,
                    emailVerified: true,
                }),
            );
        }

        // Check user status
        if (user.status !== UserStatus.ACTIVE) {
            throw new Error('Account is not active');
        }

        // Generate tokens
        const tokens = await this.generateAuthToken(user.id);

        const { id, googleId, ...userData } = user;

        return { userData: { id, ...userData }, ...tokens };
    }

    async generateAuthToken(userId: string) {
        const secret = this.configService.get<string>('app.jwt.secret');
        const expiresIn = this.configService.get<string>('app.jwt.expiresIn') || '7d';

        const accessToken = jwt.sign({ id: userId }, secret, { expiresIn });

        const resetSecret = this.configService.get<string>('app.jwt.resetSecret');
        const refreshToken = jwt.sign({ id: userId }, resetSecret, {
            expiresIn: '30d',
        });

        return { accessToken, refreshToken };
    }

    async createSupportRequest(userId: string, data: Partial<CustomerSupport>) {
        const supportRequest = this.supportRepository.create({
            userId,
            ...data,
        });

        await this.supportRepository.save(supportRequest);

        // TODO: send confirmation email to user and notification to support team

        return supportRequest;
    }
}
