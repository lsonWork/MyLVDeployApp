import { Category } from 'src/category/entities/category.entity';
import { ProductImage } from './productImages.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
export declare class Product {
    id: number;
    name: string;
    price: number;
    description: string;
    thumbnail: string;
    category: Category;
    productImages: ProductImage[];
    isDeleted: boolean;
    warehouse: Warehouse;
}
