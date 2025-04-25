import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seeds/seed.service';
import { LeaveType, LeaveTypeSchema } from '../leave/schemas/leave-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveType.name, schema: LeaveTypeSchema }
    ])
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}