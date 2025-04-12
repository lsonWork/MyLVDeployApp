import { Account } from 'src/auth/entities/account.entity';
import { Repository } from 'typeorm';
import { CustomAccountRepository } from './account.repository';
import { GetAccountDTO } from './DTO/getAccountDTO';
import { SignupDTO } from 'src/auth/DTO/SignupDTO';
import { UpdateAccountDTO } from './DTO/updateAccountDTO';
import { EditProfileDTO } from './DTO/editProfileDTO';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
export declare class AccountService {
    private accountRepo;
    private customRepo;
    private jwtService;
    private mailService;
    constructor(accountRepo: Repository<Account>, customRepo: CustomAccountRepository, jwtService: JwtService, mailService: MailService);
    getAllAccount(queries: GetAccountDTO): Promise<{
        data: Account[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAccountById(id: number): Promise<Account>;
    deleteAccountById(id: number): Promise<void>;
    recoveryAccount(idRecovery: number): Promise<void>;
    createAccount(signupDTO: SignupDTO): Promise<Account>;
    updateInfoAccount(idAccount: number, updateAccountDTO: UpdateAccountDTO): Promise<void>;
    editProfile(user: Account, editProfileDTO: EditProfileDTO): Promise<void>;
    createGoogleAccount(body: any): Promise<{
        accessToken: string;
    }>;
    getProfile(myId: number): Promise<Account[]>;
    checkPassword(enteredPassword: any, databasePassword: any): Promise<boolean>;
    checkAddress(user: any): Promise<boolean>;
    checkEmail(email: string): Promise<boolean>;
    generateOtp: (length?: number) => string;
    checkOTP(email: string, otp: string): Promise<boolean>;
}
