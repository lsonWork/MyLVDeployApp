import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './DTO/CreateOrderDTO';
import { Account } from 'src/auth/entities/account.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { SetStatusDTO } from './DTO/SetStatusDTO';
import { GetOrderDTO } from './DTO/GetOrderDTO';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { GetOrderDTOSeller } from './DTO/GetOrderDTOSeller';
export declare class OrderService {
    private orderRepo;
    private detailRepo;
    private proRepo;
    private accRepo;
    private wareRepo;
    constructor(orderRepo: Repository<Order>, detailRepo: Repository<OrderDetail>, proRepo: Repository<Product>, accRepo: Repository<Account>, wareRepo: Repository<Warehouse>);
    createOrder(cart: CreateOrderDTO, user: Account): Promise<Order>;
    setStatus(idOrder: number, setStatusDTO: SetStatusDTO): Promise<Order>;
    getMyOrder(user: Account, queries: any): Promise<{
        data: Order[];
        total: number;
        currentPage: number;
    }>;
    getAllOrder(user: any, queries: GetOrderDTO): Promise<Order[]>;
    getAllOrderSeller(queries: GetOrderDTOSeller): Promise<{
        data: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStatisticData(): Promise<{
        revenue: number;
        sold: number;
        remain: number;
    }>;
    getTop3(): Promise<any[]>;
    getStatisticOrder(): Promise<any[]>;
    getStatisticByYear(year: number): Promise<any[]>;
    getStatisticByMonthAndYear(year: number, month: number): Promise<any[]>;
}
