import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { Repository } from 'typeorm';
import { CustomAccountRepository } from './account.repository';
import { GetAccountDTO } from './DTO/getAccountDTO';
import { SignupDTO } from 'src/auth/DTO/SignupDTO';
import * as bcrypt from 'bcrypt';
import { UpdateAccountDTO } from './DTO/updateAccountDTO';
import { EditProfileDTO } from './DTO/editProfileDTO';
import { JwtPayload } from 'src/auth/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AccountRole } from 'src/auth/account-role.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    private customRepo: CustomAccountRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async getAllAccount(
    queries: GetAccountDTO,
  ): Promise<{ data: Account[]; total: number; page: number; limit: number }> {
    const accounts = await this.customRepo.getAccountWithCondition(queries);
    return accounts;
  }

  async getAccountById(id: number): Promise<Account> {
    const account = await this.accountRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  async deleteAccountById(id: number): Promise<void> {
    const account = await this.accountRepo.findOneBy({ id: id });

    if (!account) {
      throw new NotFoundException(`No account with id ${id}`);
    }
    if (account.role === 'ADMIN') {
      throw new BadRequestException(`You can't remove admin account`);
    }
    account.status = false;

    const result = await this.accountRepo.save(account);

    if (!result) {
      throw new NotFoundException(
        `Failed to update status for account with id ${id}`,
      );
    }
  }

  async recoveryAccount(idRecovery: number): Promise<void> {
    const account = await this.accountRepo.findOneBy({ id: idRecovery });
    if (!account) {
      throw new NotFoundException(`No account with id ${idRecovery}`);
    }

    account.status = true;
    await this.accountRepo.save(account);
  }

  async createAccount(signupDTO: SignupDTO): Promise<Account> {
    const newAccount = { ...signupDTO };

    // Kiểm tra nếu email đã tồn tại trong cơ sở dữ liệu
    const existingEmail = await this.accountRepo.findOne({
      where: { email: newAccount.email },
    });
    if (existingEmail) {
      throw new HttpException(
        {
          message: 'Email has already existed',
          code: 'EMAIL_CONFLICT',
        },
        HttpStatus.CONFLICT,
      );
    }

    // Kiểm tra nếu username đã tồn tại trong cơ sở dữ liệu
    const existingUsername = await this.accountRepo.findOne({
      where: { username: newAccount.username },
    });
    if (existingUsername) {
      throw new HttpException(
        {
          message: 'Username has already existed',
          code: 'USERNAME_CONFLICT',
        },
        HttpStatus.CONFLICT,
      );
    }

    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newAccount.password, salt);
    newAccount.password = hashedPassword;

    // Đặt trạng thái là true cho tài khoản mới
    newAccount.status = true;

    // Tạo entity mới và lưu vào cơ sở dữ liệu
    const accountEntity = this.accountRepo.create(newAccount);

    try {
      await this.accountRepo.save(accountEntity);
    } catch (e) {
      // Xử lý lỗi nếu cần
      console.log(e);
      throw new HttpException(
        {
          message: 'Error creating account',
          code: 'INTERNAL_SERVER_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return accountEntity;
  }

  async updateInfoAccount(
    idAccount: number,
    updateAccountDTO: UpdateAccountDTO,
  ): Promise<void> {
    const accountCheck = await this.accountRepo.findOneBy({ id: idAccount });

    if (!accountCheck) {
      throw new NotFoundException(`No account with id ${idAccount}`);
    }

    Object.assign(accountCheck, updateAccountDTO);

    await this.accountRepo.save(accountCheck);

    return;
  }

  async editProfile(
    user: Account,
    editProfileDTO: EditProfileDTO,
  ): Promise<void> {
    const account = await this.accountRepo.findOneBy({ id: user.id });

    if (!account) {
      throw new NotFoundException(`No account with id ${user.id}`);
    }

    Object.assign(account, editProfileDTO);

    await this.accountRepo.save(account);
    return;
  }

  async createGoogleAccount(body: any) {
    const data = await this.accountRepo.findOne({
      where: { email: body.email },
    });

    if (!data) {
      const newAccountGoogle = this.accountRepo.create({
        email: body.email,
        role: AccountRole.CUSTOMER,
        status: true,
        username: body.email.split('@')[0],
      });

      await this.accountRepo.save(newAccountGoogle);
    }

    const current = await this.accountRepo.findOne({
      where: { email: body.email },
    });

    if (current.status) {
      const payload: JwtPayload = {
        id: current.id,
        username: current.username,
        role: current.role,
      };

      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getProfile(myId: number) {
    const account = await this.accountRepo.find({
      where: { id: myId, status: true },
    });
    if (!account) {
      throw new NotFoundException(`No account with id ${myId}`);
    }
    return account;
  }

  async checkPassword(enteredPassword, databasePassword) {
    const check = await bcrypt.compare(enteredPassword, databasePassword);
    if (!check) {
      return false;
    }
    return true;
  }

  async checkAddress(user) {
    const check = await this.accountRepo.findOne({
      where: { id: user.id },
    });
    if (
      check.address === null ||
      check.fullName === null ||
      check.phone === null
    ) {
      return false;
    } else {
      return true;
    }
  }

  async checkEmail(email: string) {
    const account = await this.accountRepo.findOne({
      where: { email: email, status: true },
    });

    if (account && account.password !== null) {
      const otp = this.generateOtp(4);
      account.otp = otp;

      const now = new Date();
      now.setMinutes(now.getMinutes() + 15);
      account.otpExpired = now;

      await this.accountRepo.save(account);

      this.mailService.sendOtp(account.email, 'Reset your password!', { otp });

      return true;
    } else {
      throw new NotFoundException('No account with that email');
    }
  }
  generateOtp = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  };

  async checkOTP(email: string, otp: string) {
    const account = await this.accountRepo.findOne({
      where: { email: email, status: true },
    });
    if (account) {
      const currentTime = new Date();
      if (account.otp === otp && currentTime <= account.otpExpired) {
        return true;
      } else {
        throw new BadRequestException('OTP is wrong or expired');
      }
    } else {
      throw new NotFoundException('No account with that email');
    }
  }
}
