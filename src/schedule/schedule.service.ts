import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { CreateSchedule } from './interfaces/create-schedule.interface';
import { ResponseUtil } from '../common/utils/response.util';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { Schedule } from '@prisma/client';

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
    const LIMIT = 10;
    const startIndex = (parseInt(page) - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;

    const schedules = await this.prisma.schedule.findMany();
    return schedules.slice(startIndex, endIndex);
  }

  public async delete(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      return this.responseUtil.response({
        responseCode: 404,
        responseMessage: `Schedule with ID ${id} not found`,
        responseStatus: 'FAILED',
      });
    }
    await this.prisma.schedule.delete({ where: { id } });
    return this.responseUtil.response({
      responseMessage: 'Data deleted successfully',
    });
  }
}
