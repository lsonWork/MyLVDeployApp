import { AccountRole } from 'src/auth/account-role.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: AccountRole[]) => import("@nestjs/common").CustomDecorator<string>;
