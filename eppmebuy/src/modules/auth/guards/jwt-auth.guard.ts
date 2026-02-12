import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../../../entities/user.entity.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('INVALID TOKEN OR EXPIRED TOKEN');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('INVALID TOKEN OR EXPIRED TOKEN');
        }

        try {
            const secret = this.configService.get<string>('app.jwt.secret');
            const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

            if (!decoded || typeof decoded !== 'object' || !decoded.id) {
                throw new UnauthorizedException('INVALID OR EXPIRED TOKEN');
            }

            const user = await this.userRepository.findOne({
                where: { id: decoded.id },
            });

            if (!user || user.status?.toUpperCase() !== 'ACTIVE') {
                throw new UnauthorizedException('Access Denied');
            }

            request.user = user;
            request.token = token;
            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new UnauthorizedException('INVALID OR EXPIRED TOKEN');
        }
    }
}
