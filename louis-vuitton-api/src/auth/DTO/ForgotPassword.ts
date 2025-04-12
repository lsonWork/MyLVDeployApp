import { IsNotEmpty, Matches } from 'class-validator';

export class ForgotPasswordDTO {
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
    {
      message:
        'Password must has length [8-16], contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  newPassword: string;
}
