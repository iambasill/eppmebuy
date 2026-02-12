"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_service_js_1 = require("./auth.service.js");
const google_strategy_js_1 = require("./strategies/google.strategy.js");
const jwt_auth_guard_js_1 = require("./guards/jwt-auth.guard.js");
const user_entity_js_1 = require("../../entities/user.entity.js");
const customer_support_entity_js_1 = require("../../entities/customer-support.entity.js");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'google' }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_js_1.User, customer_support_entity_js_1.CustomerSupport]),
        ],
        controllers: [auth_controller_js_1.AuthController],
        providers: [auth_service_js_1.AuthService, google_strategy_js_1.GoogleStrategy, jwt_auth_guard_js_1.JwtAuthGuard],
        exports: [auth_service_js_1.AuthService, jwt_auth_guard_js_1.JwtAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map