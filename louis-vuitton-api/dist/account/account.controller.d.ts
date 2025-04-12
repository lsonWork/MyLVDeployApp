import { AccountService } from './account.service';
import { Account } from 'src/auth/entities/account.entity';
import { GetAccountDTO } from './DTO/getAccountDTO';
import { SignupDTO } from 'src/auth/DTO/SignupDTO';
import { UpdateAccountDTO } from './DTO/updateAccountDTO';
import { EditProfileDTO } from './DTO/editProfileDTO';
export declare class AccountController {
    private accountService;
    constructor(accountService: AccountService);
    getAccount(queries: GetAccountDTO): Promise<{
        data: Account[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAccountById(id: number): Promise<Account>;
    deleteAccount(id: number): Promise<void>;
    createAccount(signupDTO: SignupDTO): Promise<Account>;
    recoveryAccount(idRecovery: number): Promise<void>;
    updateInfoAccount(idAccount: number, updateAccountDTO: UpdateAccountDTO): Promise<void>;
    editProfile(req: any, editProfileDTO: EditProfileDTO): void;
    createGoogleAccount(bodyReq: any): Promise<{
        accessToken: string;
    }>;
    getProfile(myId: number): Promise<Account[]>;
    checkPassword(req: any, body: {
        enteredPassword: string;
    }): Promise<boolean>;
    checkAddress(req: any): Promise<boolean>;
    checkEmail(body: any): Promise<boolean>;
    checkOTP(body: any): Promise<boolean>;
}
