import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
        const storageEnv = this.configService.get<string>('app.storage.env');

        if (storageEnv === 'cloud') {
            const s3 = new S3Client({
                region: this.configService.get<string>('app.storage.cloud.region'),
                credentials: {
                    accessKeyId: this.configService.get<string>('app.storage.cloud.accessKeyId') || '',
                    secretAccessKey: this.configService.get<string>('app.storage.cloud.secretAccessKey') || '',
                },
            });

            return {
                storage: multerS3({
                    s3,
                    bucket: this.configService.get<string>('app.storage.cloud.bucketName'),
                    acl: 'public-read',
                    key: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        cb(null, `${randomName}${extname(file.originalname)}`);
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            };
        } else {
            // Local storage
            const uploadDest = join(process.cwd(), 'uploads');

            if (!existsSync(uploadDest)) {
                mkdirSync(uploadDest, { recursive: true });
            }

            return {
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        cb(null, uploadDest);
                    },
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        cb(null, `${randomName}${extname(file.originalname)}`);
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            };
        }
    }
}
