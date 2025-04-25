import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { LeaveType } from './leave-type.schema';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Schema({
  timestamps: true,
})
export class Leave extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LeaveType', required: true })
  leaveType: LeaveType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: LeaveStatus;

  @Prop({ required: true })
  days: number;

  @Prop()
  rejectionReason: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);