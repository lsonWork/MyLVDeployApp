import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './DTO/CreateProductDTO';
import { Category } from 'src/category/entities/category.entity';
import { UpdateProductDTO } from './DTO/UpdateProductDTO';
import { ProductImage } from './entities/productImages.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
export declare class ProductService {
    private proRepo;
    private cateRepo;
    private imgRepo;
    private wareRepo;
    constructor(proRepo: Repository<Product>, cateRepo: Repository<Category>, imgRepo: Repository<ProductImage>, wareRepo: Repository<Warehouse>);
    createProduct(createProductDTO: CreateProductDTO): Promise<Product>;
    getAllProductByCategory(slugCategory: string, search?: string, page?: number, limit?: number, sort?: string): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllProductForSeller(page: number, limit: number, search?: string, categoryId?: number): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    getDetailProduct(idProduct: number): Promise<Product>;
    updateProductInformation(idProduct: number, updateProductDTO: UpdateProductDTO): Promise<Product>;
    deleteProduct(idProduct: number): Promise<void>;
    recoveryProduct(idProduct: number): Promise<void>;
}
