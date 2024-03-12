import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExportDataModule } from './export-data/export-data.module';
import { GameHistoryService } from './game-history/game-history.service';
import { GameHistoryModule } from './game-history/game-history.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CommonModule } from './common/common.module';
import { ScheduleService } from './schedule/schedule.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    GameHistoryModule,
    ScheduleModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, GameHistoryService, ScheduleService],
})
export class AppModule {}
