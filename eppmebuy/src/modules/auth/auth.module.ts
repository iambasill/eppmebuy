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

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        TypeOrmModule.forFeature([User, CustomerSupport]),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule { }
