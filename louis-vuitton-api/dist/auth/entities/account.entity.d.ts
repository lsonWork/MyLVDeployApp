import { AccountRole } from '../account-role.enum';
export declare class Account {
    id: number;
    username: string;
    password: string;
    role: AccountRole;
    fullName: string;
    phone: string;
    email: string;
    address: string;
    status: boolean;
    otp: string;
    otpExpired: Date;
}
