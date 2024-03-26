import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
