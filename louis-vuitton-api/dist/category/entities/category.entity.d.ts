import { Product } from 'src/product/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    descriptionTitle: string;
    descriptionDetail: string;
    firstBanner: string;
    secondBanner: string;
    products: Product[];
    generateSlug(): void;
    isDeleted: boolean;
}
