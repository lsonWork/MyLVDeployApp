import { Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload.interface';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private accountRepo;
    constructor(accountRepo: Repository<Account>);
    validate(payload: JwtPayload): Promise<Account>;
}
export {};
