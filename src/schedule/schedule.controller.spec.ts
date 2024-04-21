import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule-dto';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { Schedule } from '@prisma/client';
import { ResponseUtil } from '../common/utils/response.util';
import { BadRequestException, HttpStatus } from '@nestjs/common';
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

  describe('getAll', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get all schedules for a valid page', async () => {
      const query: GetScheduleQueryDTO = { page: '1' };
      const expectedSchedules: Schedule[] = [
        {
          id: 'random-uuid',
          hour: 10,
          minute: 50,
          userId: 'random-user-uuid',
        },
      ];
      mockScheduleServiceInstance.getAll.mockResolvedValue(expectedSchedules);

      const schedules = await controller.getAll(query);

      expect(schedules).toEqual(
        responseUtil.response({}, { data: expectedSchedules }),
      );
      expect(mockScheduleServiceInstance.getAll).toHaveBeenLastCalledWith(
        query,
      );
    });

    it('should return an empty array for a page beyond the total number of pages', async () => {
      const query: GetScheduleQueryDTO = { page: '1000' };
      const expectedSchedules: Schedule[] = [];
      mockScheduleServiceInstance.getAll.mockResolvedValue(expectedSchedules);

      const schedules = await controller.getAll(query);

      expect(schedules).toEqual(
        responseUtil.response({}, { data: expectedSchedules }),
      );
      expect(mockScheduleServiceInstance.getAll).toHaveBeenLastCalledWith(
        query,
      );
    });

    it('should return an error for invalid query parameters (page is not a number)', async () => {
      const query: GetScheduleQueryDTO = { page: 'abc' };
      mockScheduleServiceInstance.getAll.mockRejectedValue(
        new BadRequestException(),
      );

      expect(controller.getAll(query)).rejects.toThrow(BadRequestException);
      expect(mockScheduleServiceInstance.getAll).toHaveBeenLastCalledWith(
        query,
      );
    });

    it('should return an error for invalid query parameters (page is not a positive number)', async () => {
      const query: GetScheduleQueryDTO = { page: '-1' };
      mockScheduleServiceInstance.getAll.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.getAll(query)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockScheduleServiceInstance.getAll).toHaveBeenLastCalledWith(
        query,
      );
    });

    it('should return an error if an unexpected error occurs in the service', async () => {
      const query: GetScheduleQueryDTO = { page: '1' };
      const expectedError = new Error('Unexpected error');
      mockScheduleServiceInstance.getAll.mockRejectedValue(expectedError);

      await expect(controller.getAll(query)).rejects.toThrowError(
        expectedError,
      );
      expect(mockScheduleServiceInstance.getAll).toHaveBeenLastCalledWith(
        query,
      );
    });
  });

  describe('getAll', () => {
    it('should get schedules for a user', async () => {
      const request: any = { id: 'f16b14ee-f594-4b7a-bf1d-afe67a9704aa' };
      const expectedSchedules: GetSchedule[] = [
        {
          id: '7b9a9bb7-09b5-40c5-9537-71a08a1d3e92',
          hour: 10,
          minute: 50,
        },
        {
          id: 'cdfd2836-c355-4174-9302-d57e958f1ab4',
          hour: 12,
          minute: 35,
        },
      ];
      mockScheduleServiceInstance.getSchedulesByUserId.mockResolvedValue(
        expectedSchedules,
      );

      const schedules = await controller.get(request);

      expect(schedules).toEqual(
        responseUtil.response({}, { data: expectedSchedules }),
      );
      expect(
        mockScheduleServiceInstance.getSchedulesByUserId,
      ).toHaveBeenLastCalledWith(request.id);
    });
  });
});
