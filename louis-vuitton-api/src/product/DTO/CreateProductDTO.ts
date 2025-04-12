import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  // @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  idCategory: number;

  @IsNotEmpty()
  productImages: string[];

  @IsNotEmpty()
  quantity: number;
}
