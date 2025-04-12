import { WarehouseService } from './warehouse.service';
export declare class WarehouseController {
    private wareService;
    constructor(wareService: WarehouseService);
    changeQuantity(idProduct: number, body: any): Promise<void>;
}
