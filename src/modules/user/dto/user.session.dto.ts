import {
    IsOptional,
    IsString,
} from 'class-validator';
import { User } from '../../../entities/user.entity.js';

export class CreateUserSessionDto {
    user: User;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @IsString()
    device?: string;
}
