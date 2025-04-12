import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../orderStatus.enum';
import { IsEnum } from 'class-validator';
import { Account } from 'src/auth/entities/account.entity';
import { OrderDetail } from './order-detail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Column()
  totalPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate: Date;

  @ManyToOne(() => Account)
  account: Account;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
