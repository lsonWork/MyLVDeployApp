import { OrderService } from './order.service';
import { CreateOrderDTO } from './DTO/CreateOrderDTO';
import { SetStatusDTO } from './DTO/SetStatusDTO';
import { GetOrderDTO } from './DTO/GetOrderDTO';
import { GetOrderDTOSeller } from './DTO/GetOrderDTOSeller';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    createOrder(cart: CreateOrderDTO, req: any): Promise<import("./entities/order.entity").Order>;
    setStatusOrder(idOrder: number, setStatusDTO: SetStatusDTO): Promise<import("./entities/order.entity").Order>;
    getMyOrder(req: any, queries: any): Promise<{
        data: import("./entities/order.entity").Order[];
        total: number;
        currentPage: number;
    }>;
    getAllOrder(req: any, queries: GetOrderDTO): Promise<import("./entities/order.entity").Order[]>;
    getAllOrderSeller(queries: GetOrderDTOSeller): Promise<{
        data: import("./entities/order.entity").Order[];
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
    getStatisticByYear(year: any): Promise<any[]>;
    getStatisticByMonthAndYear(year: any, month: any): Promise<any[]>;
}
