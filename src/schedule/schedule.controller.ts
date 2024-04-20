import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule-dto';
import { Schedule } from '@prisma/client';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { CustomRequest } from 'src/common/interfaces/request.interface';
import { GetSchedule } from './interfaces/get-schedule-interface';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: CustomRequest,
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<any> {
    try {
      const result = await this.scheduleService.create(
        request.id.toString(),
        createScheduleDto,
      );
      return this.responseUtil.response(
        {
          responseMessage: 'Jadwal berhasil dibuat',
          responseCode: HttpStatus.CREATED,
        },
        { data: result },
      );
    } catch (error) {
      return this.responseUtil.response(
        {
          responseMessage: 'Jadwal gagal dibuat',
          responseCode: HttpStatus.INTERNAL_SERVER_ERROR,
          responseStatus: 'FAILED',
        },
        { error: error.message },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.scheduleService.delete(id);
    return this.responseUtil.response({
      responseMessage: 'Data deleted successfully',
    });
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() query: GetScheduleQueryDTO): Promise<Schedule[]> {
    const schedules = await this.scheduleService.getAll(query);
    return this.responseUtil.response({}, { data: schedules });
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async get(@Req() request: CustomRequest): Promise<GetSchedule[]> {
    const schedules = await this.scheduleService.getSchedulesByUserId(
      request.id.toString(),
    );
    return this.responseUtil.response({}, { data: schedules });
  }
}
