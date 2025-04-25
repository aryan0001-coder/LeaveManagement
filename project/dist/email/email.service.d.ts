import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendOtpEmail(to: string, otp: string): Promise<void>;
    sendPasswordResetEmail(to: string, otp: string): Promise<void>;
    sendLeaveApplicationEmail(to: string, leaveDetails: any): Promise<void>;
    private sendEmail;
}
