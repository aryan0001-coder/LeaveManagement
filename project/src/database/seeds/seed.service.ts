import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaveType } from '../../leave/schemas/leave-type.schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(LeaveType.name) private leaveTypeModel: Model<LeaveType>,
  ) {}

  async seedLeaveTypes(): Promise<void> {
    this.logger.log('Seeding leave types');
    
    const leaveTypes = [
      { name: 'Planned Leave', description: 'Leave planned in advance' },
      { name: 'Emergency Leave', description: 'Leave for emergency situations' },
    ];

    for (const leaveType of leaveTypes) {
      const existingLeaveType = await this.leaveTypeModel.findOne({ 
        name: leaveType.name 
      });

      if (!existingLeaveType) {
        await this.leaveTypeModel.create(leaveType);
        this.logger.log(`Created leave type: ${leaveType.name}`);
      } else {
        this.logger.log(`Leave type already exists: ${leaveType.name}`);
      }
    }
    
    this.logger.log('Leave types seeding completed');
  }
}