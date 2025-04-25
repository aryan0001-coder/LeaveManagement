import { IsString, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsUrl()
  @IsOptional()
  profilePicture?: string;

  @IsOptional()
  leaveBalance? :number;
}