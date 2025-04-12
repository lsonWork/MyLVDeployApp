import { AccountRole } from '../account-role.enum';
export declare class SignupDTO {
    username: string;
    password: string;
    role?: AccountRole;
    fullName: string;
    phone?: string;
    email: string;
    status?: boolean;
}
