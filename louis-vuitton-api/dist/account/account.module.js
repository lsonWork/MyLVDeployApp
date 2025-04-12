"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const account_controller_1 = require("./account.controller");
const account_service_1 = require("./account.service");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("../auth/entities/account.entity");
const account_repository_1 = require("./account.repository");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const mail_module_1 = require("../mail/mail.module");
let AccountModule = class AccountModule {
};
exports.AccountModule = AccountModule;
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        controllers: [account_controller_1.AccountController],
        providers: [
            account_service_1.AccountService,
            account_repository_1.CustomAccountRepository,
        ],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([account_entity_1.Account]),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: 'topSecret51',
                signOptions: {
                    expiresIn: 3600,
                },
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            mail_module_1.MailModule,
        ],
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map