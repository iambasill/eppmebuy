declare const _default: (() => {
    nodeEnv: string;
    port: number;
    appName: string;
    apiBaseUrl: string;
    clientUrl: string;
    jwt: {
        secret: string | undefined;
        resetSecret: string | undefined;
        expiresIn: string;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        url: string | undefined;
        type: string;
    };
    storage: {
        env: string;
        cloud: {
            region: string | undefined;
            accessKeyId: string | undefined;
            secretAccessKey: string | undefined;
            bucketName: string | undefined;
        };
    };
    otpSecret: string | undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    appName: string;
    apiBaseUrl: string;
    clientUrl: string;
    jwt: {
        secret: string | undefined;
        resetSecret: string | undefined;
        expiresIn: string;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        url: string | undefined;
        type: string;
    };
    storage: {
        env: string;
        cloud: {
            region: string | undefined;
            accessKeyId: string | undefined;
            secretAccessKey: string | undefined;
            bucketName: string | undefined;
        };
    };
    otpSecret: string | undefined;
}>;
export default _default;
