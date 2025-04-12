import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SigninDTO } from './DTO/SigninDTO';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDTO } from './DTO/ForgotPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async signin(signinDTO: SigninDTO): Promise<{ accessToken: string }> {
    const account = await this.accountRepo.findOneBy({
      username: signinDTO.username,
    });

    if (
      account &&
      (await bcrypt.compare(signinDTO.password, account.password)) &&
      account.status
    ) {
      const payload: JwtPayload = {
        id: account.id,
        username: account.username,
        role: account.role,
      };

      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<void> {
    const account = await this.accountRepo.findOne({
      where: { email: forgotPasswordDTO.email },
    });

    if (!account) {
      throw new NotFoundException(
        `No account with email '${forgotPasswordDTO.email}'`,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      forgotPasswordDTO.newPassword,
      salt,
    );
    account.password = hashedPassword;

    await this.accountRepo.save(account);
    return;
  }
}
