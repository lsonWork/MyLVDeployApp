import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../orderStatus.enum';

export class GetOrderDTO {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
  idOrder?: number;
}
