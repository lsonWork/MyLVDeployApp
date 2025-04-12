import { IsEnum } from 'class-validator';
import { OrderStatus } from '../orderStatus.enum';

export class SetStatusDTO {
  @IsEnum(OrderStatus)
  newStatus: OrderStatus;
}
