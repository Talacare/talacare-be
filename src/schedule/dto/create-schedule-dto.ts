import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min, validate } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  minute: number;

  @IsUUID()
  userId: string;
}