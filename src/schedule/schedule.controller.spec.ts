import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule-dto';

const mockScheduleService = {
  create: jest.fn((dto) => {
    return { id: 1, ...dto };
  }),
};

describe('ScheduleController', () => {
  let controller: ScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: mockScheduleService,
        },
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      const scheduleDto: CreateScheduleDto = {
        userId: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
        hour: 10,
        minute: 30,
      };

      await expect(controller.create(scheduleDto)).resolves.toEqual({
        id: expect.any(Number),
        ...scheduleDto,
      });

      expect(mockScheduleService.create).toHaveBeenCalledWith(scheduleDto);
    });
  });
});
