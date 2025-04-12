import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDTO } from './DTO/CreateCategoryDTO';
import { GetCategoryDTO } from './DTO/GetCategoryDTO';
import { UpdateCategoryDTO } from './DTO/UpdateCategoryDTO';
export declare class CategoryController {
    private cateService;
    constructor(cateService: CategoryService);
    getCategoryForSeller(queries: GetCategoryDTO): Promise<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
    }>;
    getCategoryForClient(queries: GetCategoryDTO): Promise<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
    }>;
    createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category>;
    deleteCategory(idCategory: number): Promise<void>;
    recoveryCategory(idCategory: number): Promise<void>;
    updateCategory(updateCategory: UpdateCategoryDTO): Promise<void>;
}
