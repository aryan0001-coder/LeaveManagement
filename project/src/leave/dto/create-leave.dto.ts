import { IsNotEmpty, IsString, IsMongoId, IsDateString, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaveDto {
  @IsMongoId()
  @IsNotEmpty()
  leaveTypeId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}