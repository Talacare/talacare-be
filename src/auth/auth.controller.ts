import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
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
  @Get()
  async googleLogin(@Req() request: CustomRequest) {
    const token = await this.authService.verifyGoogleToken(request);
    return this.responseUtil.response(
      { responseMessage: 'Login Successful' },
      { token: token },
    );
  }
}
