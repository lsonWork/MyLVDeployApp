"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./entities/account.entity");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(accountRepo, jwtService) {
        this.accountRepo = accountRepo;
        this.jwtService = jwtService;
    }
    async signin(signinDTO) {
        const account = await this.accountRepo.findOneBy({
            username: signinDTO.username,
        });
        if (account &&
            (await bcrypt.compare(signinDTO.password, account.password)) &&
            account.status) {
            const payload = {
                id: account.id,
                username: account.username,
                role: account.role,
            };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException('Please check your login credentials');
        }
    }
    async forgotPassword(forgotPasswordDTO) {
        const account = await this.accountRepo.findOne({
            where: { email: forgotPasswordDTO.email },
        });
        if (!account) {
            throw new common_1.NotFoundException(`No account with email '${forgotPasswordDTO.email}'`);
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(forgotPasswordDTO.newPassword, salt);
        account.password = hashedPassword;
        await this.accountRepo.save(account);
        return;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(account_entity_1.Account)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map