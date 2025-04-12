import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './DTO/CreateProductDTO';
import { UpdateProductDTO } from './DTO/UpdateProductDTO';
export declare class ProductController {
    private proService;
    constructor(proService: ProductService);
    createProduct(createProductDTO: CreateProductDTO): Promise<Product>;
    getAllProductByCategory(slugCategory: string, search: string, limit: number, page: number, sort: string): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllProductForSeller(search: string, limit: number, page: number, categoryId: number): Promise<{
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
