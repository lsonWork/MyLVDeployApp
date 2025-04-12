import { OrderStatus } from '../orderStatus.enum';
import { Account } from 'src/auth/entities/account.entity';
import { OrderDetail } from './order-detail.entity';
export declare class Order {
    id: number;
    address: string;
    status: OrderStatus;
    totalPrice: number;
    purchaseDate: Date;
    account: Account;
    orderDetails: OrderDetail[];
}
