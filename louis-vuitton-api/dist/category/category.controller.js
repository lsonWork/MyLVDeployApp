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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const CreateCategoryDTO_1 = require("./DTO/CreateCategoryDTO");
const role_decorator_1 = require("../account/customGuard/role.decorator");
const account_role_enum_1 = require("../auth/account-role.enum");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../account/customGuard/roles.guard");
const GetCategoryDTO_1 = require("./DTO/GetCategoryDTO");
const UpdateCategoryDTO_1 = require("./DTO/UpdateCategoryDTO");
let CategoryController = class CategoryController {
    constructor(cateService) {
        this.cateService = cateService;
    }
    async getCategoryForSeller(queries) {
        return this.cateService.getCategory(queries);
    }
    async getCategoryForClient(queries) {
        return this.cateService.getCategory(queries);
    }
    async createCategory(createCategoryDTO) {
        const newCategory = await this.cateService.createCategory(createCategoryDTO);
        return newCategory;
    }
    async deleteCategory(idCategory) {
        return this.cateService.deleteCategory(idCategory);
    }
    async recoveryCategory(idCategory) {
        return this.cateService.recoveryCategory(idCategory);
    }
    async updateCategory(updateCategory) {
        return await this.cateService.updateCategory(updateCategory);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Get)('get-category-seller'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetCategoryDTO_1.GetCategoryDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryForSeller", null);
__decorate([
    (0, common_1.Get)('get-category'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetCategoryDTO_1.GetCategoryDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryForClient", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Post)('create-category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCategoryDTO_1.CreateCategoryDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Delete)('delete-category/:idCategory'),
    __param(0, (0, common_1.Param)('idCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Patch)('recovery-category/:idCategory'),
    __param(0, (0, common_1.Param)('idCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "recoveryCategory", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Patch)('update-category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateCategoryDTO_1.UpdateCategoryDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map