import { Document } from 'mongoose';
export declare class LeaveType extends Document {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const LeaveTypeSchema: import("mongoose").Schema<LeaveType, import("mongoose").Model<LeaveType, any, any, any, Document<unknown, any, LeaveType> & LeaveType & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LeaveType, Document<unknown, {}, import("mongoose").FlatRecord<LeaveType>> & import("mongoose").FlatRecord<LeaveType> & {
    _id: import("mongoose").Types.ObjectId;
}>;
