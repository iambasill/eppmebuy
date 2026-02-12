import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { forgotPasswordEvent } from '../events/forgot.password.event.js';
import { NotificationService } from '../notification.service.js';
import { EmailMessageDto } from '../dto/email.message.dto.js';
import { OtpService } from '../../otp/otp.service.js';
import { ConfigService } from '@nestjs/config';
import { createForgotHtmlEmail, createForgotTextEmail } from '../utils/email.style.utils.js';

@Injectable()
export class ForgotPasswordListener {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly otpService: OtpService,
        private readonly configService: ConfigService
    ) { }

    @OnEvent('forgot.password')
    async handleForgotPassword(event: forgotPasswordEvent): Promise<void> {
        try {
            const appName = this.configService.get('mailer.APP_NAME') || 'EppmeBuy';
            const mailFrom = this.configService.get('mailer.MAIL_FROM');
            const supportEmail = this.configService.get('mailer.SUPPORT_EMAIL') || mailFrom;

            const token = await this.otpService.createOtpCode(event.email);

            const message: EmailMessageDto = {
                from: mailFrom,
                to: event.email,
                subject: `Reset Your Password - ${appName}`,
                text: createForgotTextEmail(event.name, token, appName, supportEmail),
                html: createForgotHtmlEmail(event.name, token, appName, supportEmail),
            };

            await this.notificationService.sendToEmail(message);

        } catch (error: any) {
            console.error("Error sending forgot password email: ", error);
        }
    }
}
