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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const typeorm_2 = require("typeorm");
const account_entity_1 = require("../auth/entities/account.entity");
const order_detail_entity_1 = require("./entities/order-detail.entity");
const orderStatus_enum_1 = require("./orderStatus.enum");
const product_entity_1 = require("../product/entities/product.entity");
const class_transformer_1 = require("class-transformer");
const warehouse_entity_1 = require("../warehouse/entities/warehouse.entity");
let OrderService = class OrderService {
    constructor(orderRepo, detailRepo, proRepo, accRepo, wareRepo) {
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.proRepo = proRepo;
        this.accRepo = accRepo;
        this.wareRepo = wareRepo;
    }
    async createOrder(cart, user) {
        const errArray = [];
        await Promise.all(cart.cart.map(async (item) => {
            const product = await this.proRepo
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.warehouse', 'warehouse')
                .where('product.id = :id', { id: item.idProduct })
                .getOne();
            if (product.warehouse.quantity <= 0) {
                errArray.push(`Product ${product.name} is out of stock`);
                return;
            }
            else {
                if (product.warehouse.quantity < item.quantity) {
                    errArray.push(`Product ${product.name} is not enough for your order`);
                    return;
                }
            }
        }));
        if (errArray.length === 0) {
            const arrayProduct = await Promise.all(cart.cart.map(async (item) => {
                const product = await this.proRepo.findOneBy({ id: item.idProduct });
                if (!product) {
                    throw new common_1.NotFoundException(`No product with id ${item.idProduct}`);
                }
                const detailCart = { ...product, buyQuantity: item.quantity };
                return detailCart;
            }));
            const totalPriceOrder = arrayProduct.reduce((acc, item) => acc + item.price * item.buyQuantity, 0);
            const newOrder = this.orderRepo.create({
                address: user.address,
                status: orderStatus_enum_1.OrderStatus.PROCESSING,
                totalPrice: totalPriceOrder,
                account: user,
                purchaseDate: new Date(),
            });
            try {
                await this.orderRepo.insert(newOrder);
            }
            catch (e) {
                throw e;
            }
            const arrayNewOrderDetail = await Promise.all(cart.cart.map(async (item) => {
                const product = await this.proRepo.findOneBy({ id: item.idProduct });
                if (!product) {
                    throw new common_1.NotFoundException(`No product with id ${item.idProduct}`);
                }
                const newOrderDetail = this.detailRepo.create({
                    quantity: item.quantity,
                    buyPrice: product.price,
                    order: newOrder,
                    product: product,
                });
                return newOrderDetail;
            }));
            try {
                await this.detailRepo.insert(arrayNewOrderDetail);
            }
            catch (e) {
                throw e;
            }
            const arrayWarehouse = await Promise.all(cart.cart.map(async (item) => {
                const product = await this.proRepo.findOneBy({ id: item.idProduct });
                if (!product) {
                    throw new common_1.NotFoundException(`No product with id ${item.idProduct}`);
                }
                const warehouse = await this.wareRepo.findOneBy({
                    product: { id: product.id },
                });
                warehouse.quantity -= item.quantity;
                return warehouse;
            }));
            try {
                await this.wareRepo.save(arrayWarehouse);
            }
            catch (e) {
                throw e;
            }
            newOrder.orderDetails = arrayNewOrderDetail;
            return (0, class_transformer_1.instanceToPlain)(newOrder);
        }
        else {
            throw new common_1.BadRequestException(errArray);
        }
    }
    async setStatus(idOrder, setStatusDTO) {
        const order = await this.orderRepo.findOneBy({ id: idOrder });
        if (!order) {
            throw new common_1.NotFoundException(`No order with id ${idOrder}`);
        }
        const orderDetails = await this.detailRepo.find({
            where: { order: { id: order.id } },
            relations: ['product'],
        });
        const check = orderDetails.some((detail) => detail.product.isDeleted === true);
        if (check && setStatusDTO.newStatus === 'APPROVED') {
            throw new common_1.BadRequestException("You can't modify this order because it contains deleted product");
        }
        order.status = setStatusDTO.newStatus;
        const data = await this.orderRepo.save(order);
        return data;
    }
    async getMyOrder(user, queries) {
        const skip = (queries.page - 1) * queries.limit;
        const findOptions = {
            where: { account: { id: user.id }, status: queries?.status },
            relations: ['orderDetails'],
            skip: skip,
            take: queries.limit,
        };
        const [orders, total] = await this.orderRepo.findAndCount(findOptions);
        return {
            data: orders,
            total: total,
            currentPage: queries.page,
        };
    }
    async getAllOrder(user, queries) {
        const whereConditions = {};
        if (queries?.status) {
            whereConditions.status = queries.status;
        }
        if (queries?.idOrder) {
            whereConditions.id = queries.idOrder;
        }
        const data = await this.orderRepo.find({
            where: { ...whereConditions, account: { id: user.id } },
            relations: ['orderDetails.product', 'account'],
        });
        return data;
    }
    async getAllOrderSeller(queries) {
        const { status, idOrder, page, limit } = queries;
        const query = this.orderRepo.createQueryBuilder('order');
        query.leftJoinAndSelect('order.account', 'account');
        query.leftJoinAndSelect('order.orderDetails', 'orderDetails');
        query.leftJoinAndSelect('orderDetails.product', 'product');
        if (status) {
            query.andWhere('order.status = :status', { status });
        }
        if (idOrder) {
            query.andWhere('order.id = :idOrder', { idOrder });
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
    async getStatisticData() {
        const queryRevenue = this.orderRepo
            .createQueryBuilder('order')
            .andWhere('order.status = :status', { status: 'APPROVED' })
            .select('SUM(order.totalPrice)');
        const revenueResult = await queryRevenue.getRawOne();
        const revenue = revenueResult ? parseInt(revenueResult.sum || '0') : 0;
        const querySold = this.detailRepo
            .createQueryBuilder('detail')
            .leftJoinAndSelect('detail.order', 'order')
            .andWhere('order.status = :status', { status: 'APPROVED' })
            .select('SUM(detail.quantity)');
        const soldResult = await querySold.getRawOne();
        const sold = soldResult ? parseInt(soldResult.sum || '0') : 0;
        const queryQuantity = this.wareRepo
            .createQueryBuilder('warehouse')
            .select('SUM(warehouse.quantity)');
        const quantityResult = await queryQuantity.getRawOne();
        let remain = soldResult ? parseInt(quantityResult.sum || '0') : 0;
        remain = remain - sold;
        return { revenue, sold, remain };
    }
    async getTop3() {
        const query = this.detailRepo
            .createQueryBuilder('detail')
            .select([
            'detail.productId AS productId',
            'product.name AS productName',
            'product.thumbnail AS productThumbnail',
            'SUM(detail.quantity) AS total_quantity',
        ])
            .innerJoin('detail.order', 'order', 'detail.order.id = order.id')
            .innerJoin('detail.product', 'product', 'detail.product.id = product.id')
            .where('order.status = :status', { status: 'APPROVED' })
            .groupBy('detail.productId')
            .addGroupBy('product.name')
            .addGroupBy('product.thumbnail')
            .orderBy('total_quantity', 'DESC')
            .limit(3);
        const data = await query.getRawMany();
        return data;
    }
    async getStatisticOrder() {
        const query = this.orderRepo
            .createQueryBuilder('order')
            .select([
            'DATE(order.purchaseDate) AS purchaseDate',
            'SUM(order.totalPrice) AS totalPrice',
        ])
            .where('order.status = :status', { status: 'APPROVED' })
            .groupBy('DATE(order.purchaseDate)');
        const data = await query.getRawMany();
        return data;
    }
    async getStatisticByYear(year) {
        const query = this.orderRepo
            .createQueryBuilder('order')
            .select([
            'EXTRACT(YEAR FROM order.purchaseDate) AS year',
            'EXTRACT(MONTH FROM order.purchaseDate) AS month',
            'SUM(order.totalPrice) AS totalPrice',
        ])
            .where('order.status = :status', { status: 'APPROVED' })
            .groupBy('EXTRACT(YEAR FROM order.purchaseDate)')
            .addGroupBy('EXTRACT(MONTH FROM order.purchaseDate)')
            .having('EXTRACT(YEAR FROM order.purchaseDate) = :year', {
            year,
        });
        const data = await query.getRawMany();
        return data;
    }
    async getStatisticByMonthAndYear(year, month) {
        const query = this.orderRepo
            .createQueryBuilder('order')
            .select([
            'EXTRACT(YEAR FROM order.purchaseDate) AS year',
            'EXTRACT(MONTH FROM order.purchaseDate) AS month',
            'EXTRACT(DAY FROM order.purchaseDate) AS day',
            'SUM(order.totalPrice) AS totalPrice',
        ])
            .where('order.status = :status', { status: 'APPROVED' })
            .groupBy('EXTRACT(YEAR FROM order.purchaseDate)')
            .addGroupBy('EXTRACT(MONTH FROM order.purchaseDate)')
            .addGroupBy('EXTRACT(DAY FROM order.purchaseDate)')
            .having('EXTRACT(YEAR FROM order.purchaseDate) = :year', {
            year,
        })
            .andHaving('EXTRACT(MONTH FROM order.purchaseDate) = :month', {
            month,
        });
        const data = await query.getRawMany();
        return data;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_detail_entity_1.OrderDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(account_entity_1.Account)),
    __param(4, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map