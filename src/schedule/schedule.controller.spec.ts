import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule-dto';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { Schedule } from '@prisma/client';
import { ResponseUtil } from '../common/utils/response.util';
import { BadRequestException } from '@nestjs/common';
import { GetSchedule } from './interfaces/get-schedule-interface';
import { CustomRequest } from 'src/common/interfaces/request.interface';

const mockScheduleServiceInstance = {
  create: jest.fn().mockResolvedValue({
    id: 'mock-id',
    hour: 10,
    minute: 30,
    userId: '1937f86d-fce7-4ee6-88af-14df7bddce4a',
  }),
  delete: jest.fn(),
  getAll: jest.fn(),
  getSchedulesByUserId: jest.fn(),
};

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let responseUtil: ResponseUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: mockScheduleServiceInstance,
        },
        ResponseUtil,
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    responseUtil = module.get<ResponseUtil>(ResponseUtil);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      const userId = '1937f86d-fce7-4ee6-88af-14df7bddce4a';
      const scheduleDto: CreateScheduleDto = {
        hour: 10,
        minute: 30,
      };
      const request = { id: userId } as CustomRequest;

      const expectedResult = {
        id: expect.any(String),
        hour: 10,
        minute: 30,
        userId: userId,
      };

      mockScheduleServiceInstance.create.mockResolvedValue(expectedResult);

      const result = await controller.create(request, scheduleDto);

      expect(result).toEqual(expectedResult);
      expect(mockScheduleServiceInstance.create).toHaveBeenCalledWith(
        userId,
        scheduleDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a schedule', async () => {
      const id = '1';

      await controller.delete(id);

      expect(mockScheduleServiceInstance.delete).toHaveBeenLastCalledWith(id);
    });
  });
});
