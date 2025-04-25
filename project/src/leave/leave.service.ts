import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dayjs from 'dayjs';
import { Leave } from './schemas/leave.schema';
import { LeaveType } from './schemas/leave-type.schema';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveFilterDto } from './dto/leave-filter.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';

@Injectable()
export class LeaveService {
  private readonly logger = new Logger(LeaveService.name);

  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<Leave>,
    @InjectModel(LeaveType.name) private leaveTypeModel: Model<LeaveType>,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async create(userId: string, createLeaveDto: CreateLeaveDto): Promise<any> {
    const { leaveTypeId, startDate, endDate, reason } = createLeaveDto;

    // Validate leave type
    const leaveType = await this.leaveTypeModel.findById(leaveTypeId);
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    // Get user
    const user = await this.usersService.findById(userId);

    // Convert dates
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Check if end date is after start date
    if (end.isBefore(start)) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check if leave is backdated more than 3 days
    const today = dayjs();
    const threeDaysAgo = today.subtract(3, 'day');
    if (start.isBefore(threeDaysAgo)) {
      throw new BadRequestException('Backdated leave applications older than 3 days are not allowed');
    }

    // Calculate leave duration (excluding weekends)
    let leaveDuration = 0;
    let currentDate = start;
    



    /// will check the below function later
    while (currentDate< end) {
      // Skip weekends (Saturday = 6, Sunday = 0)
      const dayOfWeek = currentDate.day();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        leaveDuration++;
      }
      
      currentDate = currentDate.add(1, 'day');
    }

    // Check if user has enough leave balance
    if (user.leaveBalance < leaveDuration) {
      throw new BadRequestException('Insufficient leave balance');
    }

    // Check if user already has leave on any of the requested days
    const existingLeaves = await this.leaveModel.find({
      user: userId,
      $or: [
        { 
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (existingLeaves.length > 0) {
      throw new BadRequestException('You already have a leave application for one or more of the requested days');
    }

    // Create leave
    const newLeave = new this.leaveModel({
      user: userId,
      leaveType: leaveTypeId,
      startDate,
      endDate,
      reason,
      status: 'PENDING',
      days: leaveDuration,
    });

    const savedLeave = await newLeave.save();

    // Update user's leave balance
    await this.usersService.update(userId, {
      leaveBalance : user.leaveBalance - leaveDuration,
    });

    // Send confirmation email
    await this.emailService.sendLeaveApplicationEmail(user.email, {
      leaveType: leaveType.name,
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      reason,
    });

    return {
      message: 'Leave application submitted successfully',
      leave: savedLeave,
    };
  }

  async findAll(userId: string, filterDto: LeaveFilterDto): Promise<PaginationResult<Leave>> {
    const { page = 1, limit = 10, leaveTypeId } = filterDto;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { user: userId };
    
    if (leaveTypeId) {
      query.leaveType = leaveTypeId;
    }

    // Execute query with pagination
    const [leaves, total] = await Promise.all([
      this.leaveModel
        .find(query)
        .populate('leaveType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leaveModel.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      items: leaves,
      total,
      page,
      limit,
      pages,
    };
  }

  async findById(userId: string, leaveId: string): Promise<Leave> {
    const leave = await this.leaveModel
      .findOne({ _id: leaveId, user: userId })
      .populate('leaveType')
      .exec();

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }

  async findAllLeaveTypes(): Promise<LeaveType[]> {
    return this.leaveTypeModel.find().exec();
  }
}