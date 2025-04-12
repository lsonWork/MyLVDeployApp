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
exports.CustomAccountRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("../auth/entities/account.entity");
const typeorm_2 = require("typeorm");
let CustomAccountRepository = class CustomAccountRepository {
    constructor(accountRepo) {
        this.accountRepo = accountRepo;
    }
    async getAccountWithCondition(queries) {
        const { username, role, status, page, limit } = queries;
        const query = this.accountRepo.createQueryBuilder('account');
        if (username) {
            query.andWhere('LOWER(account.username) LIKE LOWER(:username)', {
                username: `%${username}%`,
            });
        }
        if (role?.toLowerCase() === 'admin' ||
            role?.toLowerCase() === 'customer' ||
            role?.toLowerCase() === 'seller') {
            query.andWhere('LOWER(account.role) = LOWER(:role)', {
                role: role,
            });
        }
        if (status === 'true' || status === 'false') {
            query.andWhere('account.status = :status', {
                status: status,
            });
        }
        if (page && limit) {
            const skip = (page - 1) * limit;
            query.skip(skip).take(limit);
        }
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
};
exports.CustomAccountRepository = CustomAccountRepository;
exports.CustomAccountRepository = CustomAccountRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomAccountRepository);
//# sourceMappingURL=account.repository.js.map