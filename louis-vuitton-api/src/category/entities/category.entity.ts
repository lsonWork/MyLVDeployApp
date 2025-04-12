import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import slugify from 'slugify';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column()
  thumbnail: string;

  @Column()
  descriptionTitle: string;

  @Column()
  descriptionDetail: string;

  @Column()
  firstBanner: string;

  @Column()
  secondBanner: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: false });
  }

  @Column()
  isDeleted: boolean;
}
