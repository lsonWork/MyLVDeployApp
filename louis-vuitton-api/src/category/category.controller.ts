import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDTO } from './DTO/CreateCategoryDTO';
import { Roles } from 'src/account/customGuard/role.decorator';
import { AccountRole } from 'src/auth/account-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/account/customGuard/roles.guard';
import { GetCategoryDTO } from './DTO/GetCategoryDTO';
import { UpdateCategoryDTO } from './DTO/UpdateCategoryDTO';

// @Roles(AccountRole.SELLER)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private cateService: CategoryService) {}

  @Roles(AccountRole.SELLER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('get-category-seller')
  async getCategoryForSeller(
    @Query() queries: GetCategoryDTO,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    return this.cateService.getCategory(queries);
  }

  @Get('get-category')
  async getCategoryForClient(
    @Query() queries: GetCategoryDTO,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    return this.cateService.getCategory(queries);
  }

  @Roles(AccountRole.SELLER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('create-category')
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const newCategory =
      await this.cateService.createCategory(createCategoryDTO);
    return newCategory;
  }

  @Roles(AccountRole.SELLER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('delete-category/:idCategory')
  async deleteCategory(@Param('idCategory') idCategory: number): Promise<void> {
    return this.cateService.deleteCategory(idCategory);
  }

  @Roles(AccountRole.SELLER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('recovery-category/:idCategory')
  async recoveryCategory(
    @Param('idCategory') idCategory: number,
  ): Promise<void> {
    return this.cateService.recoveryCategory(idCategory);
  }

  @Roles(AccountRole.SELLER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('update-category')
  async updateCategory(@Body() updateCategory: UpdateCategoryDTO) {
    return await this.cateService.updateCategory(updateCategory);
  }
}
