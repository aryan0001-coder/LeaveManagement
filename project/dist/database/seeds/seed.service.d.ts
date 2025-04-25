import { Model } from 'mongoose';
import { LeaveType } from '../../leave/schemas/leave-type.schema';
export declare class SeedService {
    private leaveTypeModel;
    private readonly logger;
    constructor(leaveTypeModel: Model<LeaveType>);
    seedLeaveTypes(): Promise<void>;
}
