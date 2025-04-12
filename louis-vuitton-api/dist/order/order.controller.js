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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const role_decorator_1 = require("../account/customGuard/role.decorator");
const account_role_enum_1 = require("../auth/account-role.enum");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../account/customGuard/roles.guard");
const CreateOrderDTO_1 = require("./DTO/CreateOrderDTO");
const SetStatusDTO_1 = require("./DTO/SetStatusDTO");
const GetOrderDTO_1 = require("./DTO/GetOrderDTO");
const GetOrderDTOSeller_1 = require("./DTO/GetOrderDTOSeller");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    createOrder(cart, req) {
        return this.orderService.createOrder(cart, req.user);
    }
    setStatusOrder(idOrder, setStatusDTO) {
        return this.orderService.setStatus(idOrder, setStatusDTO);
    }
    getMyOrder(req, queries) {
        return this.orderService.getMyOrder(req.user, queries);
    }
    getAllOrder(req, queries) {
        return this.orderService.getAllOrder(req.user, queries);
    }
    getAllOrderSeller(queries) {
        return this.orderService.getAllOrderSeller(queries);
    }
    getStatisticData() {
        return this.orderService.getStatisticData();
    }
    getTop3() {
        return this.orderService.getTop3();
    }
    getStatisticOrder() {
        return this.orderService.getStatisticOrder();
    }
    getStatisticByYear(year) {
        return this.orderService.getStatisticByYear(year);
    }
    getStatisticByMonthAndYear(year, month) {
        return this.orderService.getStatisticByMonthAndYear(year, month);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.CUSTOMER),
    (0, common_1.Post)('create-order'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrderDTO_1.CreateOrderDTO, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Patch)('set-status-order/:idOrder'),
    __param(0, (0, common_1.Param)('idOrder')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, SetStatusDTO_1.SetStatusDTO]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "setStatusOrder", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.CUSTOMER),
    (0, common_1.Get)('my-orders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getMyOrder", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.CUSTOMER),
    (0, common_1.Get)('get-order'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetOrderDTO_1.GetOrderDTO]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getAllOrder", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Get)('get-order-seller'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetOrderDTOSeller_1.GetOrderDTOSeller]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getAllOrderSeller", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Get)('get-statistic-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getStatisticData", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Get)('get-top-3'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getTop3", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Get)('get-statistic-order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getStatisticOrder", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Get)('get-statistic-by-year'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getStatisticByYear", null);
__decorate([
    (0, role_decorator_1.Roles)(account_role_enum_1.AccountRole.SELLER),
    (0, common_1.Get)('get-statistic-by-year-month'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getStatisticByMonthAndYear", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map