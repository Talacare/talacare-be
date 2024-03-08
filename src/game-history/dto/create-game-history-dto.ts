import { GameType } from '@prisma/client';

export class CreateGameHistoryDto {
  gameType: GameType;

  score: number;

  startTime: Date;

  endTime: Date;

  userId: number;
}
