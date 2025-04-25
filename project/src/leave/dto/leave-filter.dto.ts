import { IsOptional, IsMongoId } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class LeaveFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsMongoId()
  leaveTypeId?: string;
}