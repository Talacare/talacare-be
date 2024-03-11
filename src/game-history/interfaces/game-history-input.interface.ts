import { GameType } from '@prisma/client';
export interface GameHistoryInput {
  gameType: GameType;
  score: number;
  startTime: Date;
  endTime: Date;
  userId: string;
}
