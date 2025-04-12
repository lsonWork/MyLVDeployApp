import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from 'src/auth/entities/account.entity';
import { GetAccountDTO } from './DTO/getAccountDTO';
import { SignupDTO } from 'src/auth/DTO/SignupDTO';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './customGuard/role.decorator';
import { AccountRole } from 'src/auth/account-role.enum';
import { RolesGuard } from './customGuard/roles.guard';
import { UpdateAccountDTO } from './DTO/updateAccountDTO';
import { EditProfileDTO } from './DTO/editProfileDTO';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Get('get-account')
  async getAccount(
    @Query() queries: GetAccountDTO,
  ): Promise<{ data: Account[]; total: number; page: number; limit: number }> {
    return this.accountService.getAllAccount(queries);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Get('get-account/:idAccount')
  async getAccountById(@Param('idAccount') id: number): Promise<Account> {
    return this.accountService.getAccountById(id);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Delete('delete-account/:idDelete')
  async deleteAccount(@Param('idDelete') id: number) {
    return this.accountService.deleteAccountById(id);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Post('create-account')
  createAccount(@Body() signupDTO: SignupDTO) {
    return this.accountService.createAccount(signupDTO);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Patch('recovery-account/:idRecovery')
  async recoveryAccount(@Param('idRecovery') idRecovery: number) {
    await this.accountService.recoveryAccount(idRecovery);
    return;
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Patch('update-account/:idAccount')
  async updateInfoAccount(
    @Param('idAccount') idAccount: number,
    @Body() updateAccountDTO: UpdateAccountDTO,
  ): Promise<void> {
    const data = await this.accountService.updateInfoAccount(
      idAccount,
      updateAccountDTO,
    );
    return data;
  }

  @UseGuards(AuthGuard(), RolesGuard)
  // @Roles(AccountRole.CUSTOMER)
  @Patch('edit-profile')
  editProfile(@Req() req, @Body() editProfileDTO: EditProfileDTO) {
    console.log(req.user);

    this.accountService.editProfile(req.user, editProfileDTO);
    return;
  }

  @Post('create-account-google')
  @SetMetadata('isPublic', true)
  async createGoogleAccount(@Body() bodyReq) {
    const result = await this.accountService.createGoogleAccount(bodyReq);
    return result;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('get-profile')
  async getProfile(@Query('myId') myId: number) {
    const data = this.accountService.getProfile(myId);
    return data;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('check-password')
  async checkPassword(@Req() req, @Body() body: { enteredPassword: string }) {
    return await this.accountService.checkPassword(
      body.enteredPassword,
      req.user.password,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('check-info')
  async checkAddress(@Req() req) {
    return await this.accountService.checkAddress(req.user);
  }

  @Post('check-email')
  async checkEmail(@Body() body) {
    return await this.accountService.checkEmail(body.email);
  }

  @Post('check-otp')
  async checkOTP(@Body() body) {
    return await this.accountService.checkOTP(body.email, body.otp);
  }
}
