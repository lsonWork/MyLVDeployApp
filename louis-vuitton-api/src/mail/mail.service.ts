import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, templateData?: any) {
    try {
      templateData.product.forEach((item) => {
        item.totalRow = item.buyPrice * item.quantity;
      });
      await this.mailerService.sendMail({
        to,
        subject,
        template: './templateMail.hbs',
        context: templateData,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendOtp(to: string, subject: string, templateData?: any) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: './templateOTP.hbs',
        context: templateData,
      });
    } catch (error) {
      throw error;
    }
  }
}
