import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port:587,
      secure: false,
      auth: {
        user: 'coderaryan234@gmail.com',
        pass: 'szjqwehyhchcxxcn',
      },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const subject = 'Email Verification OTP';
    const html = `
      <h1>Email Verification</h1>
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, otp: string): Promise<void> {
    const subject = 'Password Reset OTP';
    const html = `
      <h1>Password Reset</h1>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendLeaveApplicationEmail(to: string, leaveDetails: any): Promise<void> {
    const subject = 'Leave Application Submitted';
    const html = `
      <h1>Leave Application Submitted</h1>
      <p>Your leave application has been submitted successfully.</p>
      <p><strong>Leave Type:</strong> ${leaveDetails.leaveType}</p>
      <p><strong>From:</strong> ${leaveDetails.startDate}</p>
      <p><strong>To:</strong> ${leaveDetails.endDate}</p>
      <p><strong>Reason:</strong> ${leaveDetails.reason}</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        from: 'coderaryan234@gmail.com',
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}