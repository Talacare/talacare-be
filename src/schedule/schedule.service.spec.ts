import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { Schedule } from '@prisma/client';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService, PrismaService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a schedule', async () => {
    const scheduleData: CreateScheduleInput = {
      userId: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
      hour: 10,
      minute: 30,
    };

    const expected = { ...scheduleData, id: expect.any(String) };
    jest.spyOn(prismaService.schedule, 'create').mockResolvedValue(expected);
    const createdSchedule = await service.create(scheduleData);

    expect(createdSchedule).toEqual(expected);
    expect(prismaService.schedule.create).toHaveBeenCalledTimes(1);
    expect(prismaService.schedule.create).toHaveBeenCalledWith({
      data: scheduleData,
    });
  });

  it('should return an empty array if the data doesnt exist', async () => {
    const expected: Schedule[] = [];
    jest.spyOn(prismaService.schedule, 'findMany').mockResolvedValue(expected);

    const query: GetScheduleQueryDTO = { page: '1' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual(expected);
    expect(schedules).toHaveLength(expected.length);
    expect(prismaService.schedule.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return an array of schedules if the data exists', async () => {
    const expected: Schedule[] = [
      {
        id: 'random-uuid',
        hour: 10,
        minute: 50,
        userId: 'random-user-uuid',
      },
    ];
    jest.spyOn(prismaService.schedule, 'findMany').mockResolvedValue(expected);

    const query: GetScheduleQueryDTO = { page: '1' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual(expected);
    expect(schedules).toHaveLength(expected.length);
    expect(prismaService.schedule.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if query is not valid', async () => {
    const expected: Schedule[] = [];
    const query: GetScheduleQueryDTO = { page: '' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual(expected);
    expect(schedules).toHaveLength(expected.length);
  });

  it('should return an empty array if query is valid but more than total data', async () => {
    const expected: Schedule[] = [
      {
        id: 'random-uuid',
        hour: 10,
        minute: 50,
        userId: 'random-user-uuid',
      },
    ];
    jest.spyOn(prismaService.schedule, 'findMany').mockResolvedValue(expected);

    const query: GetScheduleQueryDTO = { page: '100' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual([]);
    expect(schedules).toHaveLength(0);
    expect(prismaService.schedule.findMany).toHaveBeenCalledTimes(1);
  });
});
