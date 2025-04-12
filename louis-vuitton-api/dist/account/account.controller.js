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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const getAccountDTO_1 = require("./DTO/getAccountDTO");
const SignupDTO_1 = require("../auth/DTO/SignupDTO");
const passport_1 = require("@nestjs/passport");
const role_decorator_1 = require("./customGuard/role.decorator");
const account_role_enum_1 = require("../auth/account-role.enum");
const roles_guard_1 = require("./customGuard/roles.guard");
const updateAccountDTO_1 = require("./DTO/updateAccountDTO");
const editProfileDTO_1 = require("./DTO/editProfileDTO");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async getAccount(queries) {
        return this.accountService.getAllAccount(queries);
    }
    async getAccountById(id) {
        return this.accountService.getAccountById(id);
    }
    async deleteAccount(id) {
        return this.accountService.deleteAccountById(id);
    }
    createAccount(signupDTO) {
        return this.accountService.createAccount(signupDTO);
    }
    async recoveryAccount(idRecovery) {
        await this.accountService.recoveryAccount(idRecovery);
        return;
    }
    async updateInfoAccount(idAccount, updateAccountDTO) {
        const data = await this.accountService.updateInfoAccount(idAccount, updateAccountDTO);
        return data;
    }
    editProfile(req, editProfileDTO) {
        console.log(req.user);
        this.accountService.editProfile(req.user, editProfileDTO);
        return;
    }
    async createGoogleAccount(bodyReq) {
        const result = await this.accountService.createGoogleAccount(bodyReq);
        return result;
    }
    async getProfile(myId) {
        const data = this.accountService.getProfile(myId);
        return data;
    }
    async checkPassword(req, body) {
        return await this.accountService.checkPassword(body.enteredPassword, req.user.password);
    }
    async checkAddress(req) {
        return await this.accountService.checkAddress(req.user);
    }
    async checkEmail(body) {
        return await this.accountService.checkEmail(body.email);
    }
    async checkOTP(body) {
        return await this.accountService.checkOTP(body.email, body.otp);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.ADMIN),
    (0, common_1.Get)('get-account'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAccountDTO_1.GetAccountDTO]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getAccount", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.ADMIN),
    (0, common_1.Get)('get-account/:idAccount'),
    __param(0, (0, common_1.Param)('idAccount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getAccountById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.ADMIN),
    (0, common_1.Delete)('delete-account/:idDelete'),
    __param(0, (0, common_1.Param)('idDelete')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.ADMIN),
    (0, common_1.Post)('create-account'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignupDTO_1.SignupDTO]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "createAccount", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.ADMIN),
    (0, common_1.Patch)('recovery-account/:idRecovery'),
    __param(0, (0, common_1.Param)('idRecovery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "recoveryAccount", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.ADMIN),
    (0, common_1.Patch)('update-account/:idAccount'),
    __param(0, (0, common_1.Param)('idAccount')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateAccountDTO_1.UpdateAccountDTO]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateInfoAccount", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Patch)('edit-profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, editProfileDTO_1.EditProfileDTO]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "editProfile", null);
__decorate([
    (0, common_1.Post)('create-account-google'),
    (0, common_1.SetMetadata)('isPublic', true),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "createGoogleAccount", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Get)('get-profile'),
    __param(0, (0, common_1.Query)('myId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Post)('check-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "checkPassword", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Post)('check-info'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "checkAddress", null);
__decorate([
    (0, common_1.Post)('check-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Post)('check-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "checkOTP", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('account'),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
//# sourceMappingURL=account.controller.js.map