import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './productImages.entity';
import { Exclude } from 'class-transformer';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
// import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @ManyToOne(() => Category, (category) => category.products)
  @Exclude()
  category: Category;

  @OneToMany(() => ProductImage, (productImages) => productImages.product)
  productImages: ProductImage[];

  @Column()
  isDeleted: boolean;

  @OneToOne(() => Warehouse, (warehouse) => warehouse.product)
  @Exclude()
  warehouse: Warehouse;
}
