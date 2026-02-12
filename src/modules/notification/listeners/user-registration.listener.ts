import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegistrationEvent } from '../events/user.registration.event.js';
import { NotificationService } from '../notification.service.js';
import { EmailMessageDto } from '../dto/email.message.dto.js';
import { OtpService } from '../../otp/otp.service.js';
import { ConfigService } from '@nestjs/config';
import { createHtmlEmail, createPlainTextEmail } from '../utils/email.style.utils.js';

@Injectable()
export class UserRegistrationListener {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly otpService: OtpService,
        private readonly configService: ConfigService
    ) { }

    @OnEvent('user.created')
    async handleUserCreated(event: UserRegistrationEvent): Promise<void> {
        try {
            const appName = this.configService.get('mailer.APP_NAME') || 'EppmeBuy';
            const mailFrom = this.configService.get('mailer.MAIL_FROM');

            const token = await this.otpService.createOtpCode(event.email);

            const message: EmailMessageDto = {
                from: mailFrom,
                to: event.email,
                subject: `Verify Your Email - Welcome to ${appName}`,
                text: createPlainTextEmail(event.name, token, appName),
                html: createHtmlEmail(event.name, token, appName),
            };

            await this.notificationService.sendToEmail(message);

        } catch (error: any) {
            console.error("Error sending registration email: ", error);
        }
    }
}
