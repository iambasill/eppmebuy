"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    appName: process.env.APP_NAME || 'EppmeBuy',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    jwt: {
        secret: process.env.AUTH_JWT_TOKEN,
        resetSecret: process.env.AUTH_JWT_RESET_TOKEN,
        expiresIn: '7d',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'res_db',
        url: process.env.DB_URL,
        type: process.env.DB_SOURCE || 'postgres',
    },
    storage: {
        env: process.env.STORAGE_ENV || 'local',
        cloud: {
            region: process.env.CLOUD_REGION,
            accessKeyId: process.env.CLOUD_ACCESS_KEY,
            secretAccessKey: process.env.CLOUD_SECRET_KEY,
            bucketName: process.env.CLOUD_BUCKET_NAME,
        },
    },
    otpSecret: process.env.OTP_SECRET,
}));
//# sourceMappingURL=app.config.js.map