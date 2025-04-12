export class UpdateProductDTO {
  name?: string;
  price?: number;
  description?: string;
  thumbnail?: string;
  productImages: string[];
  categoryId: number;
}
