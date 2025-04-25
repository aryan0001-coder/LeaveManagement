import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(createUserDto: CreateUserDto): Promise<any>;
    sendOtp(sendOtpDto: SendOtpDto): Promise<any>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<any>;
}
