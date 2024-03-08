import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GameHistoryService],
})
export class GameHistoryModule {}
