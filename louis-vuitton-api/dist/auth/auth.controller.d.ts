import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';
import { Account } from './entities/account.entity';
import { SignupDTO } from './DTO/SignupDTO';
import { SigninDTO } from './DTO/SigninDTO';
import { ForgotPasswordDTO } from './DTO/ForgotPassword';
export declare class AuthController {
    private authService;
    private accountService;
    constructor(authService: AuthService, accountService: AccountService);
    signup(signupDTO: SignupDTO): Promise<Account>;
    signin(signinDTO: SigninDTO): Promise<{
        accessToken: string;
    }>;
    forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<void>;
}
