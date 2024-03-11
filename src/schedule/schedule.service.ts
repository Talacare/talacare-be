import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { Schedule } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  public async create(scheduleData: CreateScheduleInput): Promise<Schedule> {
    return this.prisma.schedule.create({
      data: scheduleData,
    });
  }
}
