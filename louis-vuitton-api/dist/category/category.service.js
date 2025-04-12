"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./entities/category.entity");
const typeorm_2 = require("typeorm");
let CategoryService = class CategoryService {
    constructor(cateRepo) {
        this.cateRepo = cateRepo;
    }
    async getCategory(queries) {
        const { page, limit, search, id, combobox, forClient } = queries;
        const query = this.cateRepo.createQueryBuilder('category');
        query.orderBy('category.id');
        if (id) {
            query.andWhere('category.id = :id', {
                id: id,
            });
        }
        if (search) {
            query.andWhere('LOWER(category.name) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        if (page && limit) {
            const skip = (page - 1) * limit;
            query.skip(skip).take(limit);
        }
        if (forClient === 'true') {
            query.andWhere('category.isDeleted = false');
            query.select([
                'category.id',
                'category.name',
                'category.slug',
                'category.thumbnail',
            ]);
        }
        if (combobox === 'true') {
            query.andWhere('category.isDeleted = false');
            query.select(['category.id', 'category.name', 'category.slug']);
        }
        else {
            if (!id) {
                query.select([
                    'category.id',
                    'category.name',
                    'category.slug',
                    'category.thumbnail',
                    'category.isDeleted',
                ]);
            }
            else {
                query.select([
                    'category.id',
                    'category.name',
                    'category.descriptionTitle',
                    'category.descriptionDetail',
                    'category.thumbnail',
                    'category.firstBanner',
                    'category.secondBanner',
                ]);
            }
        }
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async createCategory(createCategoryDTO) {
        const temp = this.cateRepo.create(createCategoryDTO);
        temp.isDeleted = false;
        try {
            await this.cateRepo.save(temp);
        }
        catch (e) {
            if (e.code === '23505') {
                throw new common_1.HttpException({
                    message: 'Category name has already existed',
                    code: 'CATEGORYNAME_CONFLICT',
                }, common_1.HttpStatus.CONFLICT);
            }
        }
        return temp;
    }
    async deleteCategory(idCategory) {
        const deleteCategory = await this.cateRepo.findOne({
            where: { id: idCategory },
        });
        if (!deleteCategory) {
            throw new common_1.NotFoundException(`No category with id ${idCategory}`);
        }
        deleteCategory.isDeleted = true;
        await this.cateRepo.save(deleteCategory);
    }
    async recoveryCategory(idCategory) {
        const category = await this.cateRepo.findOneBy({ id: idCategory });
        category.isDeleted = false;
        await this.cateRepo.save(category);
    }
    async updateCategory(updateCategory) {
        const selectedCategory = await this.cateRepo.findOne({
            where: { id: updateCategory.id },
        });
        if (!selectedCategory) {
            throw new common_1.NotFoundException(`No category with id ${updateCategory.id}`);
        }
        if (updateCategory.name) {
            selectedCategory.name = updateCategory.name;
        }
        if (updateCategory.thumbnail) {
            selectedCategory.thumbnail = updateCategory.thumbnail;
        }
        if (updateCategory.firstBanner) {
            selectedCategory.firstBanner = updateCategory.firstBanner;
        }
        if (updateCategory.secondBanner) {
            selectedCategory.secondBanner = updateCategory.secondBanner;
        }
        if (updateCategory.descriptionTitle) {
            selectedCategory.descriptionTitle = updateCategory.descriptionTitle;
        }
        if (updateCategory.descriptionDetail) {
            selectedCategory.descriptionDetail = updateCategory.descriptionDetail;
        }
        await this.cateRepo.save(updateCategory);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
//# sourceMappingURL=category.service.js.map