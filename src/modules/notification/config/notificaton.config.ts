import { registerAs } from '@nestjs/config';

export const twilioConfig = registerAs('twilio', () => ({
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
}));

export const mailerConfig = registerAs('mailer', () => ({
    APP_NAME: process.env.APP_NAME || "EppmeBuy",
    MAIL_FROM: process.env.MAIL_FROM,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: Number(process.env.EMAIL_PORT),
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || process.env.MAIL_FROM,
}));
