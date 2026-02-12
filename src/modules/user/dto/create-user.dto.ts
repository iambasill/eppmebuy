import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '../../../entities/enums/index.js';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.ATTENDEE;

    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;
}
