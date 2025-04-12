import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendMail(to: string, subject: string, templateData?: any): Promise<void>;
    sendOtp(to: string, subject: string, templateData?: any): Promise<void>;
}
