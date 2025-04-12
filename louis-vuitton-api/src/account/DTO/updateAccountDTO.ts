import { IsEnum } from 'class-validator';
import { AccountRole } from 'src/auth/account-role.enum';

export class UpdateAccountDTO {
  fullName?: string;
  phone?: string;
  @IsEnum(AccountRole, { message: 'Role must be ADMIN, CUSTOMER, SELLER' })
  role?: AccountRole;
}
