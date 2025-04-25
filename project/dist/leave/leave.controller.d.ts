import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveFilterDto } from './dto/leave-filter.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    createLeave(req: any, createLeaveDto: CreateLeaveDto): Promise<any>;
    getLeaves(req: any, filterDto: LeaveFilterDto): Promise<import("../common/interfaces/pagination-result.interface").PaginationResult<import("./schemas/leave.schema").Leave>>;
    getLeaveById(req: any, leaveId: string): Promise<import("./schemas/leave.schema").Leave>;
    getLeaveTypes(): Promise<import("./schemas/leave-type.schema").LeaveType[]>;
}
