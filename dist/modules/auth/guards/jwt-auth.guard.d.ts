import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity.js';
export declare class JwtAuthGuard implements CanActivate {
    private readonly configService;
    private readonly userRepository;
    constructor(configService: ConfigService, userRepository: Repository<User>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
