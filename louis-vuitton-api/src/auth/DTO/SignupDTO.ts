import { AccountRole } from '../account-role.enum';
import { IsEmail, IsEnum, IsNotEmpty, Matches } from 'class-validator';

export class SignupDTO {
  @IsNotEmpty({ message: 'Username should not be empty' })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Username should contain only letters and numbers',
  })
  username: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
    {
      message:
        'Password must has length [8-16], contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsEnum(AccountRole, {
    message: 'Role must be ADMIN, SELLER or CUSTOMER',
  })
  role?: AccountRole;

  @IsNotEmpty({ message: 'Fullname should not be empty' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Fullname should contain only letters (a-zA-Z)',
  })
  fullName: string;
  phone?: string;
  @IsEmail({}, { message: 'Please provide a valid email.' })
  email: string;
  status?: boolean;
}
