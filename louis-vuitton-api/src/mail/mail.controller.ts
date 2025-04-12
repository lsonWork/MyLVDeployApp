import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() body: { to: string; subject: string; objEmail: any }) {
    const { to, subject, objEmail } = body;
    await this.mailService.sendMail(to, subject, objEmail);
    return { message: 'Email sent successfully!' };
  }
}
