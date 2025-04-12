import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { SigninDTO } from './DTO/SigninDTO';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDTO } from './DTO/ForgotPassword';
export declare class AuthService {
    private accountRepo;
    private jwtService;
    constructor(accountRepo: Repository<Account>, jwtService: JwtService);
    signin(signinDTO: SigninDTO): Promise<{
        accessToken: string;
    }>;
    forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<void>;
}
