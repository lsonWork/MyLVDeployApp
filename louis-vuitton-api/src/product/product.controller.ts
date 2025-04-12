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
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './DTO/CreateProductDTO';
import { UpdateProductDTO } from './DTO/UpdateProductDTO';
import { instanceToPlain } from 'class-transformer';
import { Roles } from 'src/account/customGuard/role.decorator';
import { AccountRole } from 'src/auth/account-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/account/customGuard/roles.guard';

@Controller('product')
export class ProductController {
  constructor(private proService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AccountRole.SELLER)
  @Post('create-product')
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
  ): Promise<Product> {
    const result = await this.proService.createProduct(createProductDTO);
    return result;
  }

  @Get(':slugCategory')
  async getAllProductByCategory(
    @Param('slugCategory') slugCategory: string,
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('sort') sort: string,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const data = await this.proService.getAllProductByCategory(
      slugCategory,
      search,
      page,
      limit,
      sort,
    );
    return data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('')
  async getAllProductForSeller(
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('categoryId') categoryId: number,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const data = await this.proService.getAllProductForSeller(
      page,
      limit,
      search,
      categoryId,
    );
    return data;
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('detail/:idProduct')
  async getDetailProduct(
    @Param('idProduct') idProduct: number,
  ): Promise<Product> {
    const data = await this.proService.getDetailProduct(idProduct);
    return data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AccountRole.SELLER)
  @Patch('update-product-information/:idProduct')
  async updateProductInformation(
    @Param('idProduct') idProduct: number,
    @Body() updateProductDTO: UpdateProductDTO,
  ): Promise<Product> {
    const data = await this.proService.updateProductInformation(
      idProduct,
      updateProductDTO,
    );

    return instanceToPlain(data) as Product;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AccountRole.SELLER)
  @Delete('delete-product/:idProduct')
  deleteProduct(@Param('idProduct') idProduct: number) {
    return this.proService.deleteProduct(idProduct);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AccountRole.SELLER)
  @Patch('recovery-product/:idProduct')
  recoveryProduct(@Param('idProduct') idProduct: number) {
    return this.proService.recoveryProduct(idProduct);
  }
}
