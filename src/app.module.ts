import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { GameHistoryService } from './game-history/game-history.service';
import { GameHistoryModule } from './game-history/game-history.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CommonModule } from './common/common.module';
import { ScheduleService } from './schedule/schedule.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    GameHistoryModule,
    ScheduleModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    GameHistoryService,
    ScheduleService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
