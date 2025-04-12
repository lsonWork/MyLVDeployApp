import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { Account } from 'src/auth/entities/account.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
// import { APP_GUARD } from '@nestjs/core';
// import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product, Account, Warehouse]),
  ],
})
export class OrderModule {}
