export declare enum TicketSortBy {
    CREATED_AT = "createdAt",
    EVENT_START_DATE = "eventStartDate",
    EVENT_END_DATE = "eventEndDate"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare enum EventTiming {
    UPCOMING = "upcoming",
    PAST = "past",
    TODAY = "today"
}
export declare class GetMyTicketsDto {
    page?: number;
    limit?: number;
    status?: string;
    eventTiming?: EventTiming;
    eventStatus?: string;
    search?: string;
    sortBy?: TicketSortBy;
    sortOrder?: SortOrder;
}
