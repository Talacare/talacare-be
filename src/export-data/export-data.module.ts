import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExportDataService } from './export-data.service';
import { ExportDataController } from './export-data.controller';

@Module({
  controllers: [ExportDataController],
  providers: [PrismaService, ExportDataService],
})
export class ExportDataModule {}
