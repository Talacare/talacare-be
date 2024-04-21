import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'schedule', method: RequestMethod.ALL },
        { path: 'schedule/all', method: RequestMethod.GET },
      );
  }
}
