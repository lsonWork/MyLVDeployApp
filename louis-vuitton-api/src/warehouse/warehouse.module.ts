import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  imports: [TypeOrmModule.forFeature([Warehouse, Product])],
})
export class WarehouseModule {}
