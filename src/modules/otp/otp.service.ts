import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as speakeasy from 'speakeasy';
import { Otp } from '../../entities/otp.entity.js';
import { Repository } from 'typeorm';

const OtpConfig: speakeasy.TotpOptions = {
    secret: '',
    step: 3600,
    digits: 6,
};

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private readonly otpRepository: Repository<Otp>,
    ) { }

    private async getSecret(): Promise<string> {
        const secret = speakeasy.generateSecret({ length: 20 });
        return secret.base32;
    }

    private getOtp(secret: string): string {
        return speakeasy.totp({ ...OtpConfig, secret });
    }

    private verifyOtp(secret: string, token: string): boolean {
        return speakeasy.totp.verify({
            ...OtpConfig,
            secret: secret,
            token: token,
            window: 3,
        });
    }

    private async findOtpInfoByEmail(email: string): Promise<Otp> {
        const otpInfo = await this.otpRepository.findOne({ where: { email } });
        if (!otpInfo) {
            throw new NotFoundException('OTP not found');
        }
        return otpInfo;
    }

    public async createOtpCode(email: string): Promise<string> {
        const secret = await this.getSecret();
        const otp = this.getOtp(secret);

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        let otpData = await this.otpRepository.findOne({ where: { email } });
        if (otpData) {
            otpData.token = otp;
            otpData.secret = secret;
            otpData.expires = expiryDate;
        } else {
            otpData = this.otpRepository.create({
                email,
                token: otp,
                secret: secret,
                expires: expiryDate,
            });
        }

        await this.otpRepository.save(otpData);

        return otp;
    }

    public async verifyOtpCode(email: string, token: string) {
        const otpInfo = await this.findOtpInfoByEmail(email);
        if (new Date() > otpInfo.expires) {
            throw new BadRequestException('OTP has expired');
        }
        const isValid = this.verifyOtp(otpInfo.secret, token);
        if (!isValid) throw new BadRequestException('Invalid OTP');
    }
}
