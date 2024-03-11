import { IsDateString, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @IsDateString()
  remindTime: Date;

  @IsUUID()
  userId: string;
}
