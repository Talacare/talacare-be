import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({
  controllers: [GameHistoryController],
  providers: [GameHistoryService, PrismaService],
})
export class GameHistoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'game-history', method: RequestMethod.POST },
        { path: 'game-history/high-score/:gameType', method: RequestMethod.GET },
      );
  }
}
