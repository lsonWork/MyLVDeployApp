import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../orderStatus.enum';

export class GetOrderDTOSeller {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
  idOrder?: number;
  page?: number;
  limit?: number;
}
