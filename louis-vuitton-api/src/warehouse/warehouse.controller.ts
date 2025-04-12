import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Roles } from 'src/account/customGuard/role.decorator';
import { AccountRole } from 'src/auth/account-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/account/customGuard/roles.guard';

@Controller('warehouse')
@Roles(AccountRole.SELLER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WarehouseController {
  constructor(private wareService: WarehouseService) {}

  @Patch('change-quantity/:idProduct')
  changeQuantity(@Param('idProduct') idProduct: number, @Body() body) {
    return this.wareService.changeQuantity(idProduct, body.newQuantity);
  }
}
