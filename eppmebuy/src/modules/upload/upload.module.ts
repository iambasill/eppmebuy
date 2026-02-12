import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { MulterConfigService } from './multer-config.service.js';

@Module({
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useClass: MulterConfigService,
        }),
    ],
    providers: [MulterConfigService],
    exports: [MulterModule],
})
export class UploadModule { }
