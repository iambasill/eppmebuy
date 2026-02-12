"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const multerS3 = __importStar(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
let MulterConfigService = class MulterConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    createMulterOptions() {
        const storageEnv = this.configService.get('app.storage.env');
        if (storageEnv === 'cloud') {
            const s3 = new client_s3_1.S3Client({
                region: this.configService.get('app.storage.cloud.region'),
                credentials: {
                    accessKeyId: this.configService.get('app.storage.cloud.accessKeyId') || '',
                    secretAccessKey: this.configService.get('app.storage.cloud.secretAccessKey') || '',
                },
            });
            return {
                storage: multerS3({
                    s3,
                    bucket: this.configService.get('app.storage.cloud.bucketName'),
                    acl: 'public-read',
                    key: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 },
            };
        }
        else {
            const uploadDest = (0, path_1.join)(process.cwd(), 'uploads');
            if (!(0, fs_1.existsSync)(uploadDest)) {
                (0, fs_1.mkdirSync)(uploadDest, { recursive: true });
            }
            return {
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        cb(null, uploadDest);
                    },
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 },
            };
        }
    }
};
exports.MulterConfigService = MulterConfigService;
exports.MulterConfigService = MulterConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MulterConfigService);
//# sourceMappingURL=multer-config.service.js.map