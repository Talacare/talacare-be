import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { CreateSchedule } from './interfaces/create-schedule.interface';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { Schedule } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(scheduleData: CreateScheduleInput): Promise<CreateSchedule> {
    return await this.prisma.schedule.create({
      data: scheduleData,
    });
  }

  async getAll({ page }: GetScheduleQueryDTO): Promise<Schedule[]> {
    const LIMIT = 10;
    const startIndex = (parseInt(page) - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;

    const schedules = await this.prisma.schedule.findMany();
    return schedules.slice(startIndex, endIndex);
  }
}
