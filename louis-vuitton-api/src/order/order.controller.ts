import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/account/customGuard/role.decorator';
import { AccountRole } from 'src/auth/account-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/account/customGuard/roles.guard';
import { CreateOrderDTO } from './DTO/CreateOrderDTO';
import { SetStatusDTO } from './DTO/SetStatusDTO';
import { GetOrderDTO } from './DTO/GetOrderDTO';
import { GetOrderDTOSeller } from './DTO/GetOrderDTOSeller';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Roles(AccountRole.CUSTOMER)
  @Post('create-order')
  createOrder(@Body() cart: CreateOrderDTO, @Req() req) {
    return this.orderService.createOrder(cart, req.user);
  }

  @Roles(AccountRole.SELLER)
  @Patch('set-status-order/:idOrder')
  setStatusOrder(
    @Param('idOrder') idOrder: number,
    @Body() setStatusDTO: SetStatusDTO,
  ) {
    return this.orderService.setStatus(idOrder, setStatusDTO);
  }

  @Roles(AccountRole.CUSTOMER)
  @Get('my-orders')
  getMyOrder(@Req() req, @Query() queries) {
    return this.orderService.getMyOrder(req.user, queries);
  }

  @Roles(AccountRole.CUSTOMER)
  @Get('get-order')
  getAllOrder(@Req() req, @Query() queries: GetOrderDTO) {
    return this.orderService.getAllOrder(req.user, queries);
  }

  @Roles(AccountRole.SELLER)
  @Get('get-order-seller')
  getAllOrderSeller(@Query() queries: GetOrderDTOSeller) {
    return this.orderService.getAllOrderSeller(queries);
  }

  @Roles(AccountRole.SELLER)
  @Get('get-statistic-data')
  getStatisticData() {
    return this.orderService.getStatisticData();
  }

  @Roles(AccountRole.SELLER)
  @Get('get-top-3')
  getTop3() {
    return this.orderService.getTop3();
  }

  @Roles(AccountRole.SELLER)
  @Get('get-statistic-order')
  getStatisticOrder() {
    return this.orderService.getStatisticOrder();
  }

  @Roles(AccountRole.SELLER)
  @Get('get-statistic-by-year')
  getStatisticByYear(@Query('year') year) {
    return this.orderService.getStatisticByYear(year);
  }

  @Roles(AccountRole.SELLER)
  @Get('get-statistic-by-year-month')
  getStatisticByMonthAndYear(@Query('year') year, @Query('month') month) {
    return this.orderService.getStatisticByMonthAndYear(year, month);
  }
}
