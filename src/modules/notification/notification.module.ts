import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { ConfigModule } from '@nestjs/config';
import { UserRegistrationListener } from './listeners/user-registration.listener.js';
import { OtpModule } from '../otp/otp.module.js';
import { ForgotPasswordListener } from './listeners/forgot-password.listener.js';
import { mailerConfig, twilioConfig } from './config/notificaton.config.js';

@Module({
    imports: [
        ConfigModule.forFeature(twilioConfig),
        ConfigModule.forFeature(mailerConfig),
        OtpModule
    ],
    providers: [
        NotificationService,
        UserRegistrationListener,
        ForgotPasswordListener,
    ],
    exports: [NotificationService],
})
export class NotificationModule { }
