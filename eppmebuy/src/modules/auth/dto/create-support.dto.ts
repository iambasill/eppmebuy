import { IsOptional, IsString } from 'class-validator';

export class CreateSupportDto {
    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsString()
    category?: string;
}
