import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

import { WarehouseModule } from './warehouse/warehouse.module';
import { OrderModule } from './order/order.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000, // Sau 60s thì reset lại số lần được request
    //     limit: 5, // trong 60s được request 10 lần
    //   },
    // ]),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'louis-vuitton',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'louis-vuitton',
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   // entities: [Product, ProductImage, Category],
    // }),
    AccountModule,
    CategoryModule,
    ProductModule,
    WarehouseModule,
    OrderModule,
    MailModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
