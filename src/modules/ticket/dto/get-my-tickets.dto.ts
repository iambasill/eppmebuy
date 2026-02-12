import {
    IsOptional,
    IsString,
    IsInt,
    IsEnum,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TicketSortBy {
    CREATED_AT = 'createdAt',
    EVENT_START_DATE = 'eventStartDate',
    EVENT_END_DATE = 'eventEndDate',
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum EventTiming {
    UPCOMING = 'upcoming',
    PAST = 'past',
    TODAY = 'today',
}

export class GetMyTicketsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsEnum(EventTiming)
    eventTiming?: EventTiming;

    @IsOptional()
    @IsString()
    eventStatus?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(TicketSortBy)
    sortBy?: TicketSortBy = TicketSortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;
}
