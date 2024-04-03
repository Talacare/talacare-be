import { Global, Module } from '@nestjs/common';
import { ResponseUtil } from './utils/response.util';
import { AuthMiddleware } from './middleware/auth.middleware';

@Global()
@Module({
  providers: [ResponseUtil, AuthMiddleware],
  exports: [ResponseUtil, AuthMiddleware],
})
export class CommonModule {}
