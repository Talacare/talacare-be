import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getEnvironment(): Promise<string> {
    return process.env.VERCEL_ENV || 'local';
  }
  async postUser(email: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
      },
    });

    return user;
  }
}
