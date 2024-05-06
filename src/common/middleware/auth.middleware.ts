import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { verify } from 'jsonwebtoken';
import { CustomRequest } from '../interfaces/request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  use(req: CustomRequest, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'Authorization token is missing in the request header',
      );
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Bearer is missing in the request header',
      );
    }

    const token = authHeader.substring(7, authHeader.length);
    verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
      if (err) {
        throw new UnauthorizedException('Access token invalid');
      } else {
        req.id = decoded.user_id;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
      }
    });
  }
}
