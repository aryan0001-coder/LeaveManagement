"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'coderaryan234@gmail.com',
                pass: 'szjqwehyhchcxxcn',
            },
        });
    }
    async sendOtpEmail(to, otp) {
        const subject = 'Email Verification OTP';
        const html = `
      <h1>Email Verification</h1>
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;
        await this.sendEmail(to, subject, html);
    }
    async sendPasswordResetEmail(to, otp) {
        const subject = 'Password Reset OTP';
        const html = `
      <h1>Password Reset</h1>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;
        await this.sendEmail(to, subject, html);
    }
    async sendLeaveApplicationEmail(to, leaveDetails) {
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
    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: 'coderaryan234@gmail.com',
                to,
                subject,
                html,
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error.stack);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map