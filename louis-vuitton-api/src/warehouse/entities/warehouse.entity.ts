import { Exclude } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  quantity: number;

  @OneToOne(() => Product)
  @JoinColumn()
  @Exclude()
  product: Product;
}
