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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const CreateProductDTO_1 = require("./DTO/CreateProductDTO");
const UpdateProductDTO_1 = require("./DTO/UpdateProductDTO");
const class_transformer_1 = require("class-transformer");
const role_decorator_1 = require("../account/customGuard/role.decorator");
const account_role_enum_1 = require("../auth/account-role.enum");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../account/customGuard/roles.guard");
let ProductController = class ProductController {
    constructor(proService) {
        this.proService = proService;
    }
    async createProduct(createProductDTO) {
        const result = await this.proService.createProduct(createProductDTO);
        return result;
    }
    async getAllProductByCategory(slugCategory, search, limit, page, sort) {
        const data = await this.proService.getAllProductByCategory(slugCategory, search, page, limit, sort);
        return data;
    }
    async getAllProductForSeller(search, limit, page, categoryId) {
        const data = await this.proService.getAllProductForSeller(page, limit, search, categoryId);
        return data;
    }
    async getDetailProduct(idProduct) {
        const data = await this.proService.getDetailProduct(idProduct);
        return data;
    }
    async updateProductInformation(idProduct, updateProductDTO) {
        const data = await this.proService.updateProductInformation(idProduct, updateProductDTO);
        return (0, class_transformer_1.instanceToPlain)(data);
    }
    deleteProduct(idProduct) {
        return this.proService.deleteProduct(idProduct);
    }
    recoveryProduct(idProduct) {
        return this.proService.recoveryProduct(idProduct);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Post)('create-product'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDTO_1.CreateProductDTO]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)(':slugCategory'),
    __param(0, (0, common_1.Param)('slugCategory')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProductByCategory", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProductForSeller", null);
__decorate([
    (0, common_1.Get)('detail/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getDetailProduct", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Patch)('update-product-information/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateProductDTO_1.UpdateProductDTO]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProductInformation", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Delete)('delete-product/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Patch)('recovery-product/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "recoveryProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map