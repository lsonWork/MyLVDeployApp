import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';
import { Account } from './entities/account.entity';
import { SignupDTO } from './DTO/SignupDTO';
import { SigninDTO } from './DTO/SigninDTO';
import { ForgotPasswordDTO } from './DTO/ForgotPassword';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO): Promise<Account> {
    const account = await this.accountService.createAccount(signupDTO);
    return account;
  }

  @Post('signin')
  async signin(@Body() signinDTO: SigninDTO) {
    return this.authService.signin(signinDTO);
  }

  @Patch('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {}

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   console.log(req.user);
  //   console.log('abc');

  //   return req.user; // Trả về user sau khi login thành công
  // }
}
