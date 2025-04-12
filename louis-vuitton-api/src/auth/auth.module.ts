import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from 'src/account/account.service';
import { CustomAccountRepository } from 'src/account/account.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    CustomAccountRepository,
    JwtStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
