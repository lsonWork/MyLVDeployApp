import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './DTO/CreateCategoryDTO';
import { GetCategoryDTO } from './DTO/GetCategoryDTO';
import { UpdateCategoryDTO } from './DTO/UpdateCategoryDTO';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private cateRepo: Repository<Category>,
  ) {}

  async getCategory(
    queries: GetCategoryDTO,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
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
    } else {
      if (!id) {
        query.select([
          'category.id',
          'category.name',
          'category.slug',
          'category.thumbnail',
          'category.isDeleted',
        ]);
      } else {
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

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const temp = this.cateRepo.create(createCategoryDTO);
    temp.isDeleted = false;
    try {
      await this.cateRepo.save(temp);
    } catch (e) {
      if (e.code === '23505') {
        throw new HttpException(
          {
            message: 'Category name has already existed',
            code: 'CATEGORYNAME_CONFLICT',
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    return temp;
  }

  async deleteCategory(idCategory): Promise<void> {
    // const result = await this.cateRepo.delete({ id: idCategory });
    const deleteCategory = await this.cateRepo.findOne({
      where: { id: idCategory },
    });
    if (!deleteCategory) {
      throw new NotFoundException(`No category with id ${idCategory}`);
    }

    deleteCategory.isDeleted = true;
    await this.cateRepo.save(deleteCategory);
  }

  async recoveryCategory(idCategory): Promise<void> {
    const category = await this.cateRepo.findOneBy({ id: idCategory });
    category.isDeleted = false;
    await this.cateRepo.save(category);
  }

  async updateCategory(updateCategory: UpdateCategoryDTO): Promise<void> {
    const selectedCategory = await this.cateRepo.findOne({
      where: { id: updateCategory.id },
    });
    if (!selectedCategory) {
      throw new NotFoundException(`No category with id ${updateCategory.id}`);
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
}
