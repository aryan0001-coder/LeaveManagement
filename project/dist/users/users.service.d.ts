import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Otp } from './schemas/otp.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
export declare class UsersService {
    private readonly userModel;
    private readonly otpModel;
    private readonly emailService;
    private readonly logger;
    constructor(userModel: Model<User>, otpModel: Model<Otp>, emailService: EmailService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    generateOtp(email: string): Promise<string>;
    sendOtp(email: string): Promise<any>;
    verifyOtp(email: string, otpValue: string): Promise<any>;
    forgotPassword(email: string): Promise<any>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<any>;
    private hashPassword;
}
