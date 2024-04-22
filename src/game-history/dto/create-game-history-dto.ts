import { GameType } from '@prisma/client';
import { IsEnum, IsInt, IsDateString, IsUUID, Min } from 'class-validator';

export class CreateGameHistoryDto {
  @IsEnum(GameType)
  gameType: GameType;

  @IsInt()
  @Min(0)
  score: number;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;
}
