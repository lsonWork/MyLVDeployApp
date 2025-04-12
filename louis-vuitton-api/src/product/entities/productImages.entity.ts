import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ProductImage {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Exclude()
  @ManyToOne(() => Product, (product) => product.productImages)
  product: Product;
}
