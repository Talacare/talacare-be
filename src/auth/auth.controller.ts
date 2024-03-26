import { Controller, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ResponseUtil } from '../common/utils/response.util';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/common/interfaces/request.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private responseUtil: ResponseUtil,
  ) {}

  @HttpCode(HttpStatus.OK)
  async authenticate(@Req() request: CustomRequest) {
    return this.responseUtil.response(
      {},
      this.authService.getUser(request.user.id),
    );
  }
}
