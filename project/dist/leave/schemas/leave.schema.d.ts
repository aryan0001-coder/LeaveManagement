import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { LeaveType } from './leave-type.schema';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export declare class Leave extends Document {
    user: User;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: LeaveStatus;
    days: number;
    rejectionReason: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const LeaveSchema: MongooseSchema<Leave, import("mongoose").Model<Leave, any, any, any, Document<unknown, any, Leave> & Leave & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Leave, Document<unknown, {}, import("mongoose").FlatRecord<Leave>> & import("mongoose").FlatRecord<Leave> & {
    _id: import("mongoose").Types.ObjectId;
}>;
