import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportDataService {
  constructor(private prisma: PrismaService) {}
}