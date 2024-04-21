import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistoryInput } from './interfaces/game-history-input.interface';
import { GameHistory } from './interfaces/game-history.interface';
import { GameType } from '@prisma/client';

@Injectable()
export class GameHistoryService {
  constructor(private prisma: PrismaService) {}

  public async create(gameHistoryData: GameHistoryInput): Promise<GameHistory> {
    return this.prisma.gameHistory.create({
      data: gameHistoryData,
    });
  }

  async getHighScore(gameType: string, userId: string): Promise<GameHistory> {
    if (gameType !== 'PUZZLE' && gameType !== 'JUMP_N_JUMP') {
      throw new BadRequestException('Invalid game type');
    }

    return await this.prisma.gameHistory.findFirst({
      where: {
        userId,
        gameType:
          gameType === 'PUZZLE' ? GameType.PUZZLE : GameType.JUMP_N_JUMP,
      },
      orderBy: {
        score: 'desc'
      },
    });
  }
}
