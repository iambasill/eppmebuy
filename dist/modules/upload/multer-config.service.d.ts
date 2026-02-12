import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export declare class MulterConfigService implements MulterOptionsFactory {
    private readonly configService;
    constructor(configService: ConfigService);
    createMulterOptions(): MulterOptions | Promise<MulterOptions>;
}
