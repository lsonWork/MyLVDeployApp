import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  thumbnail: string;

  // @IsNotEmpty()
  descriptionTitle: string;

  // @IsNotEmpty()
  descriptionDetail: string;

  @IsNotEmpty()
  firstBanner: string;

  @IsNotEmpty()
  secondBanner: string;
}
