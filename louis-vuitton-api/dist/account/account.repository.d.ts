import { Account } from 'src/auth/entities/account.entity';
import { Repository } from 'typeorm';
import { GetAccountDTO } from './DTO/getAccountDTO';
export declare class CustomAccountRepository {
    private accountRepo;
    constructor(accountRepo: Repository<Account>);
    getAccountWithCondition(queries: GetAccountDTO): Promise<{
        data: Account[];
        total: number;
        page: number;
        limit: number;
    }>;
}
