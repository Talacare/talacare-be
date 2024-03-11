import { GameType } from '@prisma/client';
export interface GameHistory {
  id: number;
  gameType: GameType;
  score: number;
  startTime: Date;
  endTime: Date;
  userId: string;
}
