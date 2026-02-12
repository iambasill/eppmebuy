import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CreateSupportDto } from './dto/create-support.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(redirectUri: string, prompt: string, req: Request, res: Response): void | Response<any, Record<string, any>>;
    googleSwitchAuth(redirectUri: string, req: Request, res: Response): void | Response<any, Record<string, any>>;
    googleCallback(req: Request, res: Response): void;
    createSupportRequest(req: Request, dto: CreateSupportDto): Promise<{
        status: string;
        message: string;
    }>;
}
