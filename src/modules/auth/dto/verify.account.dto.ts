import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class verifyAccountDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
