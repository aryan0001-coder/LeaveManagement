"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LeaveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const leave_schema_1 = require("./schemas/leave.schema");
const leave_type_schema_1 = require("./schemas/leave-type.schema");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
let LeaveService = LeaveService_1 = class LeaveService {
    constructor(leaveModel, leaveTypeModel, usersService, emailService) {
        this.leaveModel = leaveModel;
        this.leaveTypeModel = leaveTypeModel;
        this.usersService = usersService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(LeaveService_1.name);
    }
    async create(userId, createLeaveDto) {
        const { leaveTypeId, startDate, endDate, reason } = createLeaveDto;
        const leaveType = await this.leaveTypeModel.findById(leaveTypeId);
        if (!leaveType) {
            throw new common_1.NotFoundException('Leave type not found');
        }
        const user = await this.usersService.findById(userId);
        const start = (0, dayjs_1.default)(startDate);
        const end = (0, dayjs_1.default)(endDate);
        if (end.isBefore(start)) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const today = (0, dayjs_1.default)();
        const threeDaysAgo = today.subtract(3, 'day');
        if (start.isBefore(threeDaysAgo)) {
            throw new common_1.BadRequestException('Backdated leave applications older than 3 days are not allowed');
        }
        let leaveDuration = 0;
        let currentDate = start;
        while (currentDate < end) {
            const dayOfWeek = currentDate.day();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                leaveDuration++;
            }
            currentDate = currentDate.add(1, 'day');
        }
        if (user.leaveBalance < leaveDuration) {
            throw new common_1.BadRequestException('Insufficient leave balance');
        }
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
            throw new common_1.BadRequestException('You already have a leave application for one or more of the requested days');
        }
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
        await this.usersService.update(userId, {
            leaveBalance: user.leaveBalance - leaveDuration,
        });
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
    async findAll(userId, filterDto) {
        const { page = 1, limit = 10, leaveTypeId } = filterDto;
        const skip = (page - 1) * limit;
        const query = { user: userId };
        if (leaveTypeId) {
            query.leaveType = leaveTypeId;
        }
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
    async findById(userId, leaveId) {
        const leave = await this.leaveModel
            .findOne({ _id: leaveId, user: userId })
            .populate('leaveType')
            .exec();
        if (!leave) {
            throw new common_1.NotFoundException('Leave not found');
        }
        return leave;
    }
    async findAllLeaveTypes() {
        return this.leaveTypeModel.find().exec();
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = LeaveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(leave_schema_1.Leave.name)),
    __param(1, (0, mongoose_1.InjectModel)(leave_type_schema_1.LeaveType.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        email_service_1.EmailService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map