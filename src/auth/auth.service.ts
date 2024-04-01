import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { auth } from 'firebase-admin';

import { sign } from 'jsonwebtoken';
import { CustomRequest } from 'src/common/interfaces/request.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyGoogleToken(request: CustomRequest) {
    const token = auth()
      .verifyIdToken(request.headers.authorization)
      .then(async (decodedToken) => {
        request.email = decodedToken.email;
        return await this.getAccessToken(request);
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new UnauthorizedException('Token invalid or expired');
      });

    return token;
  }

  async getAccessToken(request: CustomRequest) {
    const user = await this.getUser(request);

    const token = sign(
      {
        user_id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRED_AT },
    );

    return token;
  }

  async getUser(request: CustomRequest) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: request.email,
        },
      });
    }
    return user;
  }
}
