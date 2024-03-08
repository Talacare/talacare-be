import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GameHistoryController],
  providers: [GameHistoryService, PrismaService],
})
export class GameHistoryModule {}
