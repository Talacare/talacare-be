import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    return 'hello api-talacare';
  }

  async getEnvironment(): Promise<string> {
    return process.env.VERCEL_ENV || 'local';
  }

  async postUser(email: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
      },
    });
  }
}
