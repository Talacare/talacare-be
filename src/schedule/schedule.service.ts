import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { CreateSchedule } from './interfaces/create-schedule.interface';
import { ResponseUtil } from '../common/utils/response.util';

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
