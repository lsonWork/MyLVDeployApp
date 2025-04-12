import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';
export declare class OrderDetail {
    id: number;
    quantity: number;
    buyPrice: number;
    order: Order;
    product: Product;
}
