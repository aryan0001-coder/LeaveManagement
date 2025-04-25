import { Model } from 'mongoose';
import { Leave } from './schemas/leave.schema';
import { LeaveType } from './schemas/leave-type.schema';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveFilterDto } from './dto/leave-filter.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
export declare class LeaveService {
    private leaveModel;
    private leaveTypeModel;
    private usersService;
    private emailService;
    private readonly logger;
    constructor(leaveModel: Model<Leave>, leaveTypeModel: Model<LeaveType>, usersService: UsersService, emailService: EmailService);
    create(userId: string, createLeaveDto: CreateLeaveDto): Promise<any>;
    findAll(userId: string, filterDto: LeaveFilterDto): Promise<PaginationResult<Leave>>;
    findById(userId: string, leaveId: string): Promise<Leave>;
    findAllLeaveTypes(): Promise<LeaveType[]>;
}
