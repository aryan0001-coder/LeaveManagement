import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveFilterDto } from './dto/leave-filter.dto';

@Controller('leave')
// @UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async createLeave(@Request() req, @Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.create("680b207fe1789bf77d929ae7", createLeaveDto);
  }

  @Get()
  async getLeaves(@Request() req, @Query() filterDto: LeaveFilterDto) {
    return this.leaveService.findAll(req.user.userId, filterDto);
  }

  @Get(':leaveId')
  async getLeaveById(@Request() req, @Param('leaveId') leaveId: string) {
    return this.leaveService.findById(req.user.userId, leaveId);
  }

  @Get('types')
  async getLeaveTypes() {
    return this.leaveService.findAllLeaveTypes();
  }
}