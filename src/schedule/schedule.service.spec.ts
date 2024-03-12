import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { Schedule } from '@prisma/client';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { ResponseUtil } from '../common/utils/response.util';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prismaService: PrismaService;
  const expectedGetValidResponse: Schedule[] = [
    {
      id: 'random-uuid',
      hour: 10,
      minute: 50,
      userId: 'random-user-uuid',
    },
  ];
  const expectedGetInvalidResponse: Schedule[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService, PrismaService, ResponseUtil],
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
    jest
      .spyOn(prismaService.schedule, 'findMany')
      .mockResolvedValue(expectedGetInvalidResponse);

    const query: GetScheduleQueryDTO = { page: '1' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual(expectedGetInvalidResponse);
    expect(schedules).toHaveLength(expectedGetInvalidResponse.length);
    expect(prismaService.schedule.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return an array of schedules if the data exists', async () => {
    jest
      .spyOn(prismaService.schedule, 'findMany')
      .mockResolvedValue(expectedGetValidResponse);

    const query: GetScheduleQueryDTO = { page: '1' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual(expectedGetValidResponse);
    expect(schedules).toHaveLength(expectedGetValidResponse.length);
    expect(prismaService.schedule.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if query is not valid', async () => {
    const query: GetScheduleQueryDTO = { page: '' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual(expectedGetInvalidResponse);
    expect(schedules).toHaveLength(expectedGetInvalidResponse.length);
  });

  it('should return an empty array if query is valid but more than total data', async () => {
    jest
      .spyOn(prismaService.schedule, 'findMany')
      .mockResolvedValue(expectedGetValidResponse);

    const query: GetScheduleQueryDTO = { page: '100' };
    const schedules = await service.getAll(query);

    expect(schedules).toEqual([]);
    expect(schedules).toHaveLength(0);
    expect(prismaService.schedule.findMany).toHaveBeenCalledTimes(1);
  });

  it('it should delete a schedule', async () => {
    const id = '1';
    const expected: Schedule = {
      id,
      userId: 'someUserId',
      hour: 10,
      minute: 30,
    };
    jest
      .spyOn(prismaService.schedule, 'findUnique')
      .mockResolvedValue(expected);
    jest.spyOn(prismaService.schedule, 'delete').mockResolvedValue(expected);

    const deleteResult = await service.delete(id);

    expect(prismaService.schedule.delete).toHaveBeenCalledTimes(1);
    expect(prismaService.schedule.delete).toHaveBeenCalledWith({
      where: { id },
    });

    expect(deleteResult).toEqual({
      responseCode: 200,
      responseMessage: 'Data deleted successfully',
      responseStatus: 'SUCCESS',
    });
  });

  it('should return an error when trying to delete a schedule that does not exist', async () => {
    const nonExistentId = 'non-existent-id';
    jest.spyOn(prismaService.schedule, 'delete').mockResolvedValue(null);

    const deleteResult = await service.delete(nonExistentId);

    expect(deleteResult).toEqual(
      expect.objectContaining({
        responseCode: 404,
        responseMessage: `Schedule with ID ${nonExistentId} not found`,
        responseStatus: 'FAILED',
      }),
    );
    expect(prismaService.schedule.delete).not.toHaveBeenCalled();
  });
});
