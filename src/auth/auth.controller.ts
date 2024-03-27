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
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private responseUtil: ResponseUtil,
  ) {}

  @Get()
  async googleLogin(@Req() request: CustomRequest, @Res() response: Response) {
    const token = await this.authService.verifyGoogleToken(request);
    if (token) {
      return response
        .status(HttpStatus.OK)
        .json(
          this.responseUtil.response(
            { responseMessage: 'Login Successful' },
            { token: token },
          ),
        );
    } else {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        responseMessage: 'Token invalid or expired',
        responseStatus: 'FAILED',
        responseCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
