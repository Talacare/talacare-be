import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistoryInput } from './interfaces/game-history-input.interface';
import { GameHistory } from './interfaces/game-history.interface';

@Injectable()
export class GameHistoryService {
  constructor(private prisma: PrismaService) {}

  public async create(gameHistoryData: GameHistoryInput): Promise<GameHistory> {
    return this.prisma.gameHistory.create({
      data: gameHistoryData,
    });
  }

  // public async getGameHistoryByUser(userId: string) {

  // }
}
