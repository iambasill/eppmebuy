import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateTicketDto {
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @IsUUID()
    @IsNotEmpty()
    eventId: string;

    @IsUUID()
    @IsNotEmpty()
    ticketTierId: string;

    @IsUUID()
    @IsNotEmpty()
    ownerId: string;

    @IsString()
    @IsNotEmpty()
    issuedTo: string;

    @IsEmail()
    @IsNotEmpty()
    issuedToEmail: string;

    @IsString()
    @IsOptional()
    seatNumber?: string;

    @IsString()
    @IsOptional()
    seatZone?: string;

    @IsString()
    @IsOptional()
    ticketId?: string;

    @IsString()
    @IsOptional()
    qrCodeData?: string;

    @IsString()
    @IsOptional()
    qrCodeImageUrl?: string;
}
