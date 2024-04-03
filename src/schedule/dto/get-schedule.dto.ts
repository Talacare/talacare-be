import { IsNotEmpty, IsString } from 'class-validator';

export class GetScheduleQueryDTO {
  @IsNotEmpty()
  @IsString()
  page: string;
}
