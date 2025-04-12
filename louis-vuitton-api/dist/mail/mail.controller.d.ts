import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    sendMail(body: {
        to: string;
        subject: string;
        objEmail: any;
    }): Promise<{
        message: string;
    }>;
}
