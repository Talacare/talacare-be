import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prismaService: PrismaService;
  const mockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: {
            schedule: {
              create: mockFn,
            },
          },
        },
      ],
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
    mockFn.mockReturnValue(expected);
    const createdSchedule = await service.create(scheduleData);

    expect(createdSchedule).toEqual(expected);
    expect(prismaService.schedule.create).toHaveBeenCalledTimes(1);
    expect(prismaService.schedule.create).toHaveBeenCalledWith({ data: scheduleData });
  });
});
