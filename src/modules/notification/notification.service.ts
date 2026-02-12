import { Inject, Injectable } from '@nestjs/common';
import twilio from 'twilio';
import * as nodemailer from 'nodemailer';
import { SmsMessageDto } from './dto/sms.message.dot.js';
import { EmailMessageDto } from './dto/email.message.dto.js';
import { ConfigType } from '@nestjs/config';
import { mailerConfig, twilioConfig } from './config/notificaton.config.js';

@Injectable()
export class NotificationService {
    private readonly twilioClient: any;
    private readonly emailTransporter: any;

    constructor(
        @Inject(twilioConfig.KEY)
        private readonly twillo: ConfigType<typeof twilioConfig>,

        @Inject(mailerConfig.KEY)
        private readonly mailer: ConfigType<typeof mailerConfig>,
    ) {
        // Initialize Twilio client
        if (this.twillo.TWILIO_ACCOUNT_SID && this.twillo.TWILIO_AUTH_TOKEN) {
            this.twilioClient = twilio(
                this.twillo.TWILIO_ACCOUNT_SID,
                this.twillo.TWILIO_AUTH_TOKEN,
            );
        }

        // Initialize Nodemailer transporter for email
        if (this.mailer.EMAIL_HOST && this.mailer.EMAIL_USER) {
            this.emailTransporter = nodemailer.createTransport({
                host: this.mailer.EMAIL_HOST,
                port: this.mailer.EMAIL_PORT,
                secure: this.mailer.EMAIL_PORT === 465,
                auth: {
                    user: this.mailer.EMAIL_USER,
                    pass: this.mailer.EMAIL_PASSWORD,
                },
            });
        }
    }

    // Method to send message via SMS using Twilio
    async sendToMobile(message: SmsMessageDto) {
        if (!this.twilioClient) {
            throw new Error('Twilio client not initialized');
        }
        try {
            const result = await this.twilioClient.messages.create(message);
            return result;
        } catch (error: any) {
            throw new Error(`Failed to send via SMS: ${error.message}`);
        }
    }

    // Method to send via email using Nodemailer
    async sendToEmail(message: EmailMessageDto) {
        if (!this.emailTransporter) {
            throw new Error('Email transporter not initialized');
        }
        try {
            const result = await this.emailTransporter.sendMail(message);
            return result;
        } catch (error: any) {
            throw new Error(`Failed to send via email: ${error.message}`);
        }
    }

    async sendToAll(smsMessage: SmsMessageDto, emailMessage: EmailMessageDto) {
        try {
            await this.sendToMobile(smsMessage);
            await this.sendToEmail(emailMessage);
        } catch (error: any) {
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }
}
