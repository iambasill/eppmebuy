import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { GoogleStrategy } from './strategies/google.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { User } from '../../entities/user.entity.js';
import { CustomerSupport } from '../../entities/customer-support.entity.js';
import { UserSession } from '../../entities/user-session.entity.js';
import { HashingProvider } from './providers/hashing.provider.js';
import { BcryptProvider } from './providers/bcrypt.provider.js';
import { UserModule } from '../user/user.module.js';
import { OtpModule } from '../otp/otp.module.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        TypeOrmModule.forFeature([User, CustomerSupport, UserSession]),
        UserModule,
        OtpModule,
        NotificationModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GoogleStrategy,
        JwtAuthGuard,
        {
            provide: HashingProvider,
            useClass: BcryptProvider,
        },
    ],
    exports: [AuthService, JwtAuthGuard, HashingProvider],
})
export class AuthModule { }
