import { IsInt, Max, Min } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  minute: number;
}
