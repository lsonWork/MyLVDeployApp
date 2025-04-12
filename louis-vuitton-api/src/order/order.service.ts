import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateOrderDTO } from './DTO/CreateOrderDTO';
import { Account } from 'src/auth/entities/account.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderStatus } from './orderStatus.enum';
import { Product } from 'src/product/entities/product.entity';
import { instanceToPlain } from 'class-transformer';
import { SetStatusDTO } from './DTO/SetStatusDTO';
import { GetOrderDTO } from './DTO/GetOrderDTO';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { GetOrderDTOSeller } from './DTO/GetOrderDTOSeller';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private detailRepo: Repository<OrderDetail>,
    @InjectRepository(Product)
    private proRepo: Repository<Product>,
    @InjectRepository(Account)
    private accRepo: Repository<Account>,
    @InjectRepository(Warehouse)
    private wareRepo: Repository<Warehouse>,
  ) {}

  async createOrder(cart: CreateOrderDTO, user: Account) {
    const errArray: string[] = [];
    await Promise.all(
      cart.cart.map(async (item) => {
        const product = await this.proRepo
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.warehouse', 'warehouse')
          .where('product.id = :id', { id: item.idProduct })
          .getOne();
        if (product.warehouse.quantity <= 0) {
          errArray.push(`Product ${product.name} is out of stock`);
          return;
        } else {
          if (product.warehouse.quantity < item.quantity) {
            errArray.push(
              `Product ${product.name} is not enough for your order`,
            );
            return;
          }
        }
      }),
    );

    if (errArray.length === 0) {
      //xử lý order trước khi lưu
      const arrayProduct = await Promise.all(
        cart.cart.map(async (item) => {
          const product = await this.proRepo.findOneBy({ id: item.idProduct });
          if (!product) {
            throw new NotFoundException(`No product with id ${item.idProduct}`);
          }
          const detailCart = { ...product, buyQuantity: item.quantity };
          return detailCart;
        }),
      );

      const totalPriceOrder = arrayProduct.reduce(
        (acc, item) => acc + item.price * item.buyQuantity,
        0,
      );

      const newOrder = this.orderRepo.create({
        address: user.address,
        status: OrderStatus.PROCESSING,
        totalPrice: totalPriceOrder,
        account: user,
        purchaseDate: new Date(),
      });
      //Lưu order
      try {
        await this.orderRepo.insert(newOrder);
      } catch (e) {
        throw e;
      }

      //xử lý order detail trước khi lưu
      const arrayNewOrderDetail = await Promise.all(
        cart.cart.map(async (item) => {
          const product = await this.proRepo.findOneBy({ id: item.idProduct });
          if (!product) {
            throw new NotFoundException(`No product with id ${item.idProduct}`);
          }
          const newOrderDetail = this.detailRepo.create({
            quantity: item.quantity,
            buyPrice: product.price,
            order: newOrder,
            product: product,
          });
          return newOrderDetail;
        }),
      );

      //Lưu order detail
      try {
        await this.detailRepo.insert(arrayNewOrderDetail);
      } catch (e) {
        throw e;
      }

      //Xử lý warehouse
      const arrayWarehouse = await Promise.all(
        cart.cart.map(async (item) => {
          const product = await this.proRepo.findOneBy({ id: item.idProduct });
          if (!product) {
            throw new NotFoundException(`No product with id ${item.idProduct}`);
          }

          const warehouse = await this.wareRepo.findOneBy({
            product: { id: product.id },
          });
          warehouse.quantity -= item.quantity;
          return warehouse;
        }),
      );
      // console.log(arrayWarehouse);

      //lưu warehouse
      try {
        await this.wareRepo.save(arrayWarehouse);
      } catch (e) {
        throw e;
      }

      newOrder.orderDetails = arrayNewOrderDetail;
      return instanceToPlain(newOrder) as Order;
    } else {
      throw new BadRequestException(errArray);
    }
  }

  async setStatus(idOrder: number, setStatusDTO: SetStatusDTO): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: idOrder });
    if (!order) {
      throw new NotFoundException(`No order with id ${idOrder}`);
    }

    const orderDetails = await this.detailRepo.find({
      where: { order: { id: order.id } },
      relations: ['product'],
    });

    const check = orderDetails.some(
      (detail) => detail.product.isDeleted === true,
    );

    if (check && setStatusDTO.newStatus === 'APPROVED') {
      throw new BadRequestException(
        "You can't modify this order because it contains deleted product",
      );
    }

    order.status = setStatusDTO.newStatus;

    const data = await this.orderRepo.save(order);
    return data;
  }

  async getMyOrder(
    user: Account,
    queries,
  ): Promise<{ data: Order[]; total: number; currentPage: number }> {
    const skip = (queries.page - 1) * queries.limit;

    const findOptions: FindManyOptions<Order> = {
      where: { account: { id: user.id }, status: queries?.status },
      relations: ['orderDetails'], // Nạp thêm product nếu cần
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

  async getAllOrder(user, queries: GetOrderDTO): Promise<Order[]> {
    const whereConditions: any = {};

    if (queries?.status) {
      whereConditions.status = queries.status;
    }

    if (queries?.idOrder) {
      whereConditions.id = queries.idOrder;
    }

    const data = await this.orderRepo.find({
      where: { ...whereConditions, account: { id: user.id } },
      // where: whereConditions,
      relations: ['orderDetails.product', 'account'],
    });

    return data;
  }

  async getAllOrderSeller(queries: GetOrderDTOSeller) {
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

  async getStatisticByYear(year: number) {
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

  async getStatisticByMonthAndYear(year: number, month: number) {
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
}
