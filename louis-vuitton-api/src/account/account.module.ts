import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { CustomAccountRepository } from './account.repository';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/mail/mail.module';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './customGuard/roles.guard';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    CustomAccountRepository,
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [
    TypeOrmModule.forFeature([Account]),
    AuthModule,
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
  ],
})
export class AccountModule {}
