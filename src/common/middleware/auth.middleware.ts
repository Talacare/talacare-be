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

    const resUnauthorized = this.responseUtil.response({
      responseCode: HttpStatus.UNAUTHORIZED,
      responseStatus: 'FAILED',
      responseMessage: 'Unauthorized',
    });
    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json(resUnauthorized);
    }

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length);
      verify(token, process.env.JWTSECRET, (err, decoded: any) => {
        if (err) {
          return res.status(HttpStatus.UNAUTHORIZED).json(resUnauthorized);
        } else {
          next();

          req.user = { id: decoded.id, email: decoded.email };
        }
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(resUnauthorized);
    }
  }
}
