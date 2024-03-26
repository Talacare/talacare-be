import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth', method: RequestMethod.GET });
  }
}
