import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './DTO/CreateCategoryDTO';
import { GetCategoryDTO } from './DTO/GetCategoryDTO';
import { UpdateCategoryDTO } from './DTO/UpdateCategoryDTO';
export declare class CategoryService {
    private cateRepo;
    constructor(cateRepo: Repository<Category>);
    getCategory(queries: GetCategoryDTO): Promise<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
    }>;
    createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category>;
    deleteCategory(idCategory: any): Promise<void>;
    recoveryCategory(idCategory: any): Promise<void>;
    updateCategory(updateCategory: UpdateCategoryDTO): Promise<void>;
}
