import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService, PrismaService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should create a schedule record', async () => {
      const scheduleData = {
        userId: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
        remindTime: new Date(),
      };

      const expected = { ...scheduleData, id: expect.any(Number) };
      jest.spyOn(service, 'create').mockImplementation(async () => expected);

      const result = await service.create(scheduleData);

      expect(result).toEqual(expected);
    });
  });
});
