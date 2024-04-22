import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExportDataService } from './export-data.service';
import { ExportDataController } from './export-data.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({
  controllers: [ExportDataController],
  providers: [PrismaService, ExportDataService],
})
export class ExportDataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'export-data', method: RequestMethod.GET });
  }
}
