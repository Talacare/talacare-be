import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';
import { HttpStatus } from '@nestjs/common/enums';
import { verify } from 'jsonwebtoken';
import { CustomRequest } from '../interfaces/request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly responseUtil: ResponseUtil) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        this.responseUtil.response({
          responseCode: HttpStatus.UNAUTHORIZED,
          responseStatus: 'FAILED',
          responseMessage:
            'Authorization token is missing in the request header',
        }),
      );
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        this.responseUtil.response({
          responseCode: HttpStatus.UNAUTHORIZED,
          responseStatus: 'FAILED',
          responseMessage: 'Bearer is missing in the request header',
        }),
      );
    }

    const token = authHeader.substring(7, authHeader.length);
    verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          this.responseUtil.response({
            responseCode: HttpStatus.UNAUTHORIZED,
            responseStatus: 'FAILED',
            responseMessage: 'Access token invalid',
          }),
        );
      } else {
        req.id = decoded.user_id;
        req.email = decoded.email;
        next();
      }
    });
  }
}
