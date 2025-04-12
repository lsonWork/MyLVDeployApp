import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
export declare class WarehouseService {
    private wareRepo;
    constructor(wareRepo: Repository<Warehouse>);
    changeQuantity(idProduct: number, newQuantity: number): Promise<void>;
}
