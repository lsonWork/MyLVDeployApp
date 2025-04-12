import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './DTO/CreateProductDTO';
import { Category } from 'src/category/entities/category.entity';
import { UpdateProductDTO } from './DTO/UpdateProductDTO';
import { ProductImage } from './entities/productImages.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private proRepo: Repository<Product>,
    @InjectRepository(Category)
    private cateRepo: Repository<Category>,
    @InjectRepository(ProductImage)
    private imgRepo: Repository<ProductImage>,
    @InjectRepository(Warehouse)
    private wareRepo: Repository<Warehouse>,
  ) {}

  async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
    const category = await this.cateRepo.findOneBy({
      id: createProductDTO.idCategory,
      isDeleted: false,
    });

    if (!category) {
      throw new HttpException(
        {
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
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
      const productImage = new ProductImage();
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
    } catch (e) {
      if (e.code === '23505') {
        throw new HttpException(
          {
            message: 'Product name has already existed',
            code: 'CATEGORYNAME_CONFLICT',
          },
          HttpStatus.CONFLICT,
        );
      }
      throw e;
    }

    return instanceToPlain(createProduct) as Product;
  }

  async getAllProductByCategory(
    slugCategory: string,
    search?: string,
    page?: number,
    limit?: number,
    sort?: string,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const category = await this.cateRepo.findOne({
      where: { slug: slugCategory, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`No category with slug ${slugCategory}`);
    }

    const query = this.proRepo.createQueryBuilder('product');
    query.leftJoinAndSelect('product.category', 'category');
    query.leftJoinAndSelect('product.warehouse', 'warehouse');
    query.where(
      'category.slug = :slugCategory AND category.isDeleted = false AND product.isDeleted = false AND warehouse.quantity > 0',
      { slugCategory },
    );

    if (sort) {
      query.orderBy('product.price', sort.toUpperCase() as 'ASC' | 'DESC');
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

  async getAllProductForSeller(
    page: number,
    limit: number,
    search?: string,
    categoryId?: number,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
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

  async getDetailProduct(idProduct: number): Promise<Product> {
    const data = await this.proRepo.findOne({
      where: { id: idProduct },
      relations: ['productImages', 'category', 'warehouse'],
    });

    if (!data) {
      throw new NotFoundException(`No product with id ${idProduct}`);
    }

    return data;
  }

  async updateProductInformation(
    idProduct: number,
    updateProductDTO: UpdateProductDTO,
  ): Promise<Product> {
    const updatedProduct = await this.proRepo.findOneBy({
      id: idProduct,
      isDeleted: false,
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product is not exist`);
    }

    //Update các field đơn giản
    Object.assign(updatedProduct, updateProductDTO);

    //Update category
    const category = await this.cateRepo.findOneBy({
      id: updateProductDTO.categoryId,
      isDeleted: false,
    });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${updateProductDTO.categoryId} is not exist`,
      );
    }

    updatedProduct.category = category;

    //Update productImages
    updatedProduct.productImages = updateProductDTO.productImages.map(
      (path) => {
        const updateProductImage = new ProductImage();
        updateProductImage.path = path;
        updateProductImage.product = updatedProduct;
        return updateProductImage;
      },
    );

    await this.imgRepo.delete({ product: { id: idProduct } });

    try {
      await this.proRepo.save(updatedProduct);
      await this.imgRepo.save(updatedProduct.productImages);
      updatedProduct.productImages.forEach((item) => delete item.product);
    } catch (e) {
      throw e;
    }

    return updatedProduct;
  }

  async deleteProduct(idProduct: number): Promise<void> {
    const product = await this.proRepo.findOneBy({ id: idProduct });
    product.isDeleted = true;
    await this.proRepo.save(product);
  }

  async recoveryProduct(idProduct: number): Promise<void> {
    const product = await this.proRepo.findOneBy({ id: idProduct });
    if (!product) {
      throw new Error(`No product with id ${idProduct}`);
    }

    product.isDeleted = false;
    await this.proRepo.save(product);
  }
}
