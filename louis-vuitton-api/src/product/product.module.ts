import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { ProductImage } from './entities/productImages.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage, Warehouse]),
  ],
})
export class ProductModule {}
