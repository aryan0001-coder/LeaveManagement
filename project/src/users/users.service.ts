import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Otp } from './schemas/otp.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create new user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isEmailVerified: false,
      leaveBalance: 6, // Initialize with 6 leaves for new users
    });

    const savedUser = await newUser.save();

    // Generate and send OTP
    await this.sendOtp(email);

    return {
      message: 'User created successfully. Please verify your email with the OTP sent.',
      userId: savedUser._id,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only update allowed fields
    const { name, profilePicture } = updateUserDto;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();

    return updatedUser;
  }

  async generateOtp(email: string): Promise<string> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry time to 5 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Save OTP to database
    await this.otpModel.findOneAndUpdate(
      { email },
      { email, otp, expiresAt },
      { upsert: true, new: true },
    );

    return otp;
  }

  async sendOtp(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = await this.generateOtp(email);

    // Send OTP via email
    await this.emailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otpValue: string): Promise<any> {
    const otpRecord = await this.otpModel.findOne({ email });
    
    if (!otpRecord) {
      throw new NotFoundException('OTP not found');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    if (otpRecord.otp !== otpValue) {
      throw new BadRequestException('Invalid OTP');
    }

    // Mark user email as verified
    await this.userModel.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
    );

    // Delete used OTP
    await this.otpModel.findOneAndDelete({ email });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = await this.generateOtp(email);

    // Send password reset OTP via email
    await this.emailService.sendPasswordResetEmail(email, otp);

    return { message: 'Password reset OTP sent successfully' };
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<any> {
    // First verify the OTP
    await this.verifyOtp(email, otp);

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user's password
    await this.userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
    );

    return { message: 'Password reset successful' };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}