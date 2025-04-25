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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("./schemas/user.schema");
const otp_schema_1 = require("./schemas/otp.schema");
const email_service_1 = require("../email/email.service");
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel, otpModel, emailService) {
        this.userModel = userModel;
        this.otpModel = otpModel;
        this.emailService = emailService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        const { email, password } = createUserDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await this.hashPassword(password);
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
            isEmailVerified: false,
            leaveBalance: 6,
        });
        const savedUser = await newUser.save();
        await this.sendOtp(email);
        return {
            message: 'User created successfully. Please verify your email with the OTP sent.',
            userId: savedUser._id,
        };
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findById(id) {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async update(id, updateUserDto) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { name, profilePicture } = updateUserDto;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (profilePicture)
            updateData.profilePicture = profilePicture;
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .select('-password')
            .exec();
        return updatedUser;
    }
    async generateOtp(email) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        await this.otpModel.findOneAndUpdate({ email }, { email, otp, expiresAt }, { upsert: true, new: true });
        return otp;
    }
    async sendOtp(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otp = await this.generateOtp(email);
        await this.emailService.sendOtpEmail(email, otp);
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(email, otpValue) {
        const otpRecord = await this.otpModel.findOne({ email });
        if (!otpRecord) {
            throw new common_1.NotFoundException('OTP not found');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        if (otpRecord.otp !== otpValue) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        await this.userModel.findOneAndUpdate({ email }, { isEmailVerified: true });
        await this.otpModel.findOneAndDelete({ email });
        return { message: 'Email verified successfully' };
    }
    async forgotPassword(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otp = await this.generateOtp(email);
        await this.emailService.sendPasswordResetEmail(email, otp);
        return { message: 'Password reset OTP sent successfully' };
    }
    async resetPassword(email, otp, newPassword) {
        await this.verifyOtp(email, otp);
        const hashedPassword = await this.hashPassword(newPassword);
        await this.userModel.findOneAndUpdate({ email }, { password: hashedPassword });
        return { message: 'Password reset successful' };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map