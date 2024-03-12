import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { ResponseUtil } from '../common/utils/response.util';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prismaService: PrismaService;
  let responseUtil: ResponseUtil;
  const mockFn = jest.fn();

  beforeEach(async () => {
    const mockFindUnique = jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === '1') {
        return Promise.resolve({ id });
      }
      return Promise.resolve(null);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: {
            schedule: {
              create: mockFn,
              findUnique: mockFindUnique,
              delete: jest.fn().mockResolvedValue({ id: 'existing_id' }),
            },
          },
        },
        ResponseUtil,
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prismaService = module.get<PrismaService>(PrismaService);
    responseUtil = module.get<ResponseUtil>(ResponseUtil);
  });

  it('should create a schedule', async () => {
    const scheduleData: CreateScheduleInput = {
      userId: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
      hour: 10,
      minute: 30,
    };

    const expected = { ...scheduleData, id: expect.any(String) };
    mockFn.mockReturnValue(expected);
    const createdSchedule = await service.create(scheduleData);

    expect(createdSchedule).toEqual(expected);
    expect(prismaService.schedule.create).toHaveBeenCalledTimes(1);
    expect(prismaService.schedule.create).toHaveBeenCalledWith({
      data: scheduleData,
    });
  });

  it('it should delete a schedule', async () => {
    const id = '1';
    const expected = { id };
    mockFn.mockResolvedValueOnce(expected);

    await service.delete(id);

    expect(prismaService.schedule.delete).toHaveBeenCalledTimes(1);
    expect(prismaService.schedule.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should return an error when trying to delete a schedule that does not exist', async () => {
    const nonExistentId = 'non-existent-id';
    mockFn.mockResolvedValueOnce(null);

    const result = await service.delete(nonExistentId);

    expect(result).toEqual(
      expect.objectContaining({
        responseCode: 404,
        responseMessage: `Schedule with ID ${nonExistentId} not found`,
        responseStatus: 'FAILED',
      }),
    );
    expect(prismaService.schedule.delete).not.toHaveBeenCalled();
  });
});
