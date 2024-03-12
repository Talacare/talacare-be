import { GameType } from '@prisma/client';
export interface GameHistory {
  id: string;
  gameType: GameType;
  score: number;
  startTime: Date;
  endTime: Date;
  userId: string;
}
