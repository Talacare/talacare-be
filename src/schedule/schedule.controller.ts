import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule-dto';
import { Schedule } from '@prisma/client';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return this.scheduleService.create(createScheduleDto);
  }
}
