import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExportDataModule } from './export-data/export-data.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, ExportDataModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
