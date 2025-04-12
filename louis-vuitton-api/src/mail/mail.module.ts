import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'happygwennnnn@gmail.com',
          pass: 'vmxa jvvs nbsj sehu',
        },
      },
      defaults: {
        from: 'LouisVuitton',
      },
      template: {
        dir: join(process.cwd(), 'src', 'mail', 'templates'), // Thư mục template
        adapter: new HandlebarsAdapter(), // Sử dụng Handlebars
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
