import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { CreateSchedule } from './interfaces/create-schedule.interface';
import { ResponseUtil } from '../common/utils/response.util';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { Schedule } from '@prisma/client';
import { GetSchedule } from './interfaces/get-schedule-interface';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  public async create(
    scheduleData: CreateScheduleInput,
  ): Promise<CreateSchedule> {
    return this.prisma.schedule.create({
      data: scheduleData,
    });
  }

  async getAll({ page }: GetScheduleQueryDTO): Promise<Schedule[]> {
    const parsedPage = Number(page);
    if (isNaN(parsedPage) || parsedPage <= 0) {
      throw new BadRequestException('Page should be a positive number');
    }
    const LIMIT = 10;
    const startIndex = (parsedPage - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;

    const schedules = await this.prisma.schedule.findMany();
    return schedules.slice(startIndex, endIndex);
  }

  async delete(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    await this.prisma.schedule.delete({ where: { id } });
  }

  async getSchedulesByUserId(userId: string): Promise<GetSchedule[]> {
    const schedules = await this.prisma.schedule.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        hour: true,
        minute: true,
      },
      orderBy: [{ hour: 'asc' }, { minute: 'asc' }],
    });

    return schedules.map((schedule) => ({
      id: schedule.id,
      hour: schedule.hour,
      minute: schedule.minute,
    }));
  }
}
