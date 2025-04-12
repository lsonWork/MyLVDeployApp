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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("../auth/entities/account.entity");
const typeorm_2 = require("typeorm");
const account_repository_1 = require("./account.repository");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const account_role_enum_1 = require("../auth/account-role.enum");
const mail_service_1 = require("../mail/mail.service");
let AccountService = class AccountService {
    constructor(accountRepo, customRepo, jwtService, mailService) {
        this.accountRepo = accountRepo;
        this.customRepo = customRepo;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.generateOtp = (length = 6) => {
            const digits = '0123456789';
            let otp = '';
            for (let i = 0; i < length; i++) {
                otp += digits[Math.floor(Math.random() * digits.length)];
            }
            return otp;
        };
    }
    async getAllAccount(queries) {
        const accounts = await this.customRepo.getAccountWithCondition(queries);
        return accounts;
    }
    async getAccountById(id) {
        const account = await this.accountRepo.findOne({
            where: {
                id: id,
            },
        });
        if (!account) {
            throw new common_1.NotFoundException();
        }
        return account;
    }
    async deleteAccountById(id) {
        const account = await this.accountRepo.findOneBy({ id: id });
        if (!account) {
            throw new common_1.NotFoundException(`No account with id ${id}`);
        }
        if (account.role === 'ADMIN') {
            throw new common_1.BadRequestException(`You can't remove admin account`);
        }
        account.status = false;
        const result = await this.accountRepo.save(account);
        if (!result) {
            throw new common_1.NotFoundException(`Failed to update status for account with id ${id}`);
        }
    }
    async recoveryAccount(idRecovery) {
        const account = await this.accountRepo.findOneBy({ id: idRecovery });
        if (!account) {
            throw new common_1.NotFoundException(`No account with id ${idRecovery}`);
        }
        account.status = true;
        await this.accountRepo.save(account);
    }
    async createAccount(signupDTO) {
        const newAccount = { ...signupDTO };
        const existingEmail = await this.accountRepo.findOne({
            where: { email: newAccount.email },
        });
        if (existingEmail) {
            throw new common_1.HttpException({
                message: 'Email has already existed',
                code: 'EMAIL_CONFLICT',
            }, common_1.HttpStatus.CONFLICT);
        }
        const existingUsername = await this.accountRepo.findOne({
            where: { username: newAccount.username },
        });
        if (existingUsername) {
            throw new common_1.HttpException({
                message: 'Username has already existed',
                code: 'USERNAME_CONFLICT',
            }, common_1.HttpStatus.CONFLICT);
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newAccount.password, salt);
        newAccount.password = hashedPassword;
        newAccount.status = true;
        const accountEntity = this.accountRepo.create(newAccount);
        try {
            await this.accountRepo.save(accountEntity);
        }
        catch (e) {
            console.log(e);
            throw new common_1.HttpException({
                message: 'Error creating account',
                code: 'INTERNAL_SERVER_ERROR',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return accountEntity;
    }
    async updateInfoAccount(idAccount, updateAccountDTO) {
        const accountCheck = await this.accountRepo.findOneBy({ id: idAccount });
        if (!accountCheck) {
            throw new common_1.NotFoundException(`No account with id ${idAccount}`);
        }
        Object.assign(accountCheck, updateAccountDTO);
        await this.accountRepo.save(accountCheck);
        return;
    }
    async editProfile(user, editProfileDTO) {
        const account = await this.accountRepo.findOneBy({ id: user.id });
        if (!account) {
            throw new common_1.NotFoundException(`No account with id ${user.id}`);
        }
        Object.assign(account, editProfileDTO);
        await this.accountRepo.save(account);
        return;
    }
    async createGoogleAccount(body) {
        const data = await this.accountRepo.findOne({
            where: { email: body.email },
        });
        if (!data) {
            const newAccountGoogle = this.accountRepo.create({
                email: body.email,
                role: account_role_enum_1.AccountRole.CUSTOMER,
                status: true,
                username: body.email.split('@')[0],
            });
            await this.accountRepo.save(newAccountGoogle);
        }
        const current = await this.accountRepo.findOne({
            where: { email: body.email },
        });
        if (current.status) {
            const payload = {
                id: current.id,
                username: current.username,
                role: current.role,
            };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException('Please check your login credentials');
        }
    }
    async getProfile(myId) {
        const account = await this.accountRepo.find({
            where: { id: myId, status: true },
        });
        if (!account) {
            throw new common_1.NotFoundException(`No account with id ${myId}`);
        }
        return account;
    }
    async checkPassword(enteredPassword, databasePassword) {
        const check = await bcrypt.compare(enteredPassword, databasePassword);
        if (!check) {
            return false;
        }
        return true;
    }
    async checkAddress(user) {
        const check = await this.accountRepo.findOne({
            where: { id: user.id },
        });
        if (check.address === null ||
            check.fullName === null ||
            check.phone === null) {
            return false;
        }
        else {
            return true;
        }
    }
    async checkEmail(email) {
        const account = await this.accountRepo.findOne({
            where: { email: email, status: true },
        });
        if (account && account.password !== null) {
            const otp = this.generateOtp(4);
            account.otp = otp;
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15);
            account.otpExpired = now;
            await this.accountRepo.save(account);
            this.mailService.sendOtp(account.email, 'Reset your password!', { otp });
            return true;
        }
        else {
            throw new common_1.NotFoundException('No account with that email');
        }
    }
    async checkOTP(email, otp) {
        const account = await this.accountRepo.findOne({
            where: { email: email, status: true },
        });
        if (account) {
            const currentTime = new Date();
            if (account.otp === otp && currentTime <= account.otpExpired) {
                return true;
            }
            else {
                throw new common_1.BadRequestException('OTP is wrong or expired');
            }
        }
        else {
            throw new common_1.NotFoundException('No account with that email');
        }
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        account_repository_1.CustomAccountRepository,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AccountService);
//# sourceMappingURL=account.service.js.map