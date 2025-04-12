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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../category/entities/category.entity");
const productImages_entity_1 = require("./entities/productImages.entity");
const warehouse_entity_1 = require("../warehouse/entities/warehouse.entity");
const class_transformer_1 = require("class-transformer");
let ProductService = class ProductService {
    constructor(proRepo, cateRepo, imgRepo, wareRepo) {
        this.proRepo = proRepo;
        this.cateRepo = cateRepo;
        this.imgRepo = imgRepo;
        this.wareRepo = wareRepo;
    }
    async createProduct(createProductDTO) {
        const category = await this.cateRepo.findOneBy({
            id: createProductDTO.idCategory,
            isDeleted: false,
        });
        if (!category) {
            throw new common_1.HttpException({
                message: 'Category not found',
                code: 'CATEGORY_NOT_FOUND',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const createProduct = this.proRepo.create({
            name: createProductDTO.name,
            price: createProductDTO.price,
            description: createProductDTO?.description,
            thumbnail: createProductDTO.thumbnail,
            category: category,
            isDeleted: false,
        });
        const productImages = createProductDTO.productImages.map((imagePath) => {
            const productImage = new productImages_entity_1.ProductImage();
            productImage.path = imagePath;
            productImage.product = createProduct;
            return productImage;
        });
        createProduct.productImages = productImages;
        const createWarehouse = this.wareRepo.create({
            quantity: createProductDTO.quantity,
        });
        try {
            const productSaved = await this.proRepo.save(createProduct);
            await this.imgRepo.save(productImages);
            createWarehouse.product = productSaved;
            await this.wareRepo.insert(createWarehouse);
        }
        catch (e) {
            if (e.code === '23505') {
                throw new common_1.HttpException({
                    message: 'Product name has already existed',
                    code: 'CATEGORYNAME_CONFLICT',
                }, common_1.HttpStatus.CONFLICT);
            }
            throw e;
        }
        return (0, class_transformer_1.instanceToPlain)(createProduct);
    }
    async getAllProductByCategory(slugCategory, search, page, limit, sort) {
        const category = await this.cateRepo.findOne({
            where: { slug: slugCategory, isDeleted: false },
        });
        if (!category) {
            throw new common_1.NotFoundException(`No category with slug ${slugCategory}`);
        }
        const query = this.proRepo.createQueryBuilder('product');
        query.leftJoinAndSelect('product.category', 'category');
        query.leftJoinAndSelect('product.warehouse', 'warehouse');
        query.where('category.slug = :slugCategory AND category.isDeleted = false AND product.isDeleted = false AND warehouse.quantity > 0', { slugCategory });
        if (sort) {
            query.orderBy('product.price', sort.toUpperCase());
        }
        if (search) {
            query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async getAllProductForSeller(page, limit, search, categoryId) {
        const query = this.proRepo.createQueryBuilder('product');
        query.leftJoinAndSelect('product.warehouse', 'warehouse');
        query.leftJoinAndSelect('product.category', 'category');
        if (search) {
            query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        if (categoryId) {
            query.andWhere('product.category = :categoryId', {
                categoryId: categoryId,
            });
        }
        query.select([
            'product.id',
            'product.thumbnail',
            'product.name',
            'product.price',
            'warehouse.quantity',
            'category.name',
            'product.isDeleted',
        ]);
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async getDetailProduct(idProduct) {
        const data = await this.proRepo.findOne({
            where: { id: idProduct },
            relations: ['productImages', 'category', 'warehouse'],
        });
        if (!data) {
            throw new common_1.NotFoundException(`No product with id ${idProduct}`);
        }
        return data;
    }
    async updateProductInformation(idProduct, updateProductDTO) {
        const updatedProduct = await this.proRepo.findOneBy({
            id: idProduct,
            isDeleted: false,
        });
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product is not exist`);
        }
        Object.assign(updatedProduct, updateProductDTO);
        const category = await this.cateRepo.findOneBy({
            id: updateProductDTO.categoryId,
            isDeleted: false,
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${updateProductDTO.categoryId} is not exist`);
        }
        updatedProduct.category = category;
        updatedProduct.productImages = updateProductDTO.productImages.map((path) => {
            const updateProductImage = new productImages_entity_1.ProductImage();
            updateProductImage.path = path;
            updateProductImage.product = updatedProduct;
            return updateProductImage;
        });
        await this.imgRepo.delete({ product: { id: idProduct } });
        try {
            await this.proRepo.save(updatedProduct);
            await this.imgRepo.save(updatedProduct.productImages);
            updatedProduct.productImages.forEach((item) => delete item.product);
        }
        catch (e) {
            throw e;
        }
        return updatedProduct;
    }
    async deleteProduct(idProduct) {
        const product = await this.proRepo.findOneBy({ id: idProduct });
        product.isDeleted = true;
        await this.proRepo.save(product);
    }
    async recoveryProduct(idProduct) {
        const product = await this.proRepo.findOneBy({ id: idProduct });
        if (!product) {
            throw new Error(`No product with id ${idProduct}`);
        }
        product.isDeleted = false;
        await this.proRepo.save(product);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(productImages_entity_1.ProductImage)),
    __param(3, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map