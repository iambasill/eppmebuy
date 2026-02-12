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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt = __importStar(require("jsonwebtoken"));
const user_entity_js_1 = require("../../entities/user.entity.js");
const index_js_1 = require("../../entities/enums/index.js");
const customer_support_entity_js_1 = require("../../entities/customer-support.entity.js");
let AuthService = AuthService_1 = class AuthService {
    configService;
    userRepository;
    supportRepository;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(configService, userRepository, supportRepository) {
        this.configService = configService;
        this.userRepository = userRepository;
        this.supportRepository = supportRepository;
    }
    async handleGoogleLogin(profile, req) {
        let user = await this.userRepository.findOne({
            where: [
                { googleId: profile.googleId },
                { email: profile.email },
            ],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                status: true,
                googleId: true,
            },
        });
        if (user && !user.googleId) {
            user = await this.userRepository.save({
                ...user,
                googleId: profile.googleId,
                emailVerified: true,
            });
        }
        else if (!user) {
            user = await this.userRepository.save(this.userRepository.create({
                googleId: profile.googleId,
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                status: index_js_1.UserStatus.ACTIVE,
                emailVerified: true,
            }));
        }
        if (user.status !== index_js_1.UserStatus.ACTIVE) {
            throw new Error('Account is not active');
        }
        const tokens = await this.generateAuthToken(user.id);
        const { id, googleId, ...userData } = user;
        return { userData: { id, ...userData }, ...tokens };
    }
    async generateAuthToken(userId) {
        const secret = this.configService.get('app.jwt.secret');
        const expiresIn = this.configService.get('app.jwt.expiresIn') || '7d';
        const accessToken = jwt.sign({ id: userId }, secret, { expiresIn });
        const resetSecret = this.configService.get('app.jwt.resetSecret');
        const refreshToken = jwt.sign({ id: userId }, resetSecret, {
            expiresIn: '30d',
        });
        return { accessToken, refreshToken };
    }
    async createSupportRequest(userId, data) {
        const supportRequest = this.supportRepository.create({
            userId,
            ...data,
        });
        await this.supportRepository.save(supportRequest);
        return supportRequest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_js_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_support_entity_js_1.CustomerSupport)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map