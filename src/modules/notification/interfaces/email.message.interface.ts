export interface EmailMessageInterface {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string | null;
}
