import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './interfaces/create-schedule-input.interface';
import { Schedule } from '@prisma/client';
import { GetScheduleQueryDTO } from './dto/get-schedule.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  schedule: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prismaService: PrismaService;
  const expectedGetEmptyResponse: Schedule[] = [];
  const expectedGetNotEmptyResponse: Schedule[] = [
    {
      id: 'random-uuid',
      hour: 10,
      minute: 50,
      userId: 'random-user-uuid',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        ResponseUtil,
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);

    mockPrisma.schedule.create.mockClear();
    mockPrisma.schedule.delete.mockClear();
    mockPrisma.schedule.findMany.mockClear();
    mockPrisma.schedule.findUnique.mockClear();
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      const scheduleData: CreateScheduleInput = {
        userId: '81c41b32-7a45-4b64-a98e-928f16fc26d7',
        hour: 10,
        minute: 30,
      };

      const expected = { ...scheduleData, id: expect.any(String) };
      jest.spyOn(mockPrisma.schedule, 'create').mockResolvedValue(expected);
      const createdSchedule = await service.create(scheduleData);

      expect(createdSchedule).toEqual(expected);
      expect(mockPrisma.schedule.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.schedule.create).toHaveBeenCalledWith({
        data: scheduleData,
      });
    });
  });

  describe('get all', () => {
    it("should return an empty array if the data doesn't exist", async () => {
      jest
        .spyOn(mockPrisma.schedule, 'findMany')
        .mockResolvedValue(expectedGetEmptyResponse);

      const query: GetScheduleQueryDTO = { page: '1' };
      const schedules = await service.getAll(query);

      expect(schedules).toEqual(expectedGetEmptyResponse);
      expect(schedules).toHaveLength(expectedGetEmptyResponse.length);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an array of schedules if the data exists', async () => {
      jest
        .spyOn(mockPrisma.schedule, 'findMany')
        .mockResolvedValue(expectedGetNotEmptyResponse);

      const query: GetScheduleQueryDTO = { page: '1' };
      const schedules = await service.getAll(query);

      expect(schedules).toEqual(expectedGetNotEmptyResponse);
      expect(schedules).toHaveLength(expectedGetNotEmptyResponse.length);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if page is not a number', async () => {
      const query: GetScheduleQueryDTO = { page: 'invalidPage' };

      await expect(service.getAll(query)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if page is not a positive number', async () => {
      const query: GetScheduleQueryDTO = { page: '-10' };

      await expect(service.getAll(query)).rejects.toThrow(BadRequestException);
    });

    it('should return an empty array for a page beyond the total number of pages', async () => {
      jest
        .spyOn(mockPrisma.schedule, 'findMany')
        .mockResolvedValue(expectedGetNotEmptyResponse);

      const query: GetScheduleQueryDTO = { page: '1000' };
      const schedules = await service.getAll(query);

      expect(schedules).toEqual(expectedGetEmptyResponse);
      expect(schedules).toHaveLength(0);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an error if an unexpected error occurs in the service', async () => {
      jest
        .spyOn(mockPrisma.schedule, 'findMany')
        .mockRejectedValue(new Error('Unexpected error'));

      const query: GetScheduleQueryDTO = { page: '1' };

      expect(service.getAll(query)).rejects.toThrow(Error);
    });
  });

  describe('delete', () => {
    it('it should delete a schedule', async () => {
      const id = '1';
      const expected: Schedule = {
        id,
        userId: 'someUserId',
        hour: 10,
        minute: 30,
      };
      jest.spyOn(mockPrisma.schedule, 'findUnique').mockResolvedValue(expected);
      jest.spyOn(mockPrisma.schedule, 'delete').mockResolvedValue(expected);

      await service.delete(id);

      expect(mockPrisma.schedule.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.schedule.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should return an error when trying to delete a schedule that does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      jest.spyOn(mockPrisma.schedule, 'findUnique').mockResolvedValue(null);

      expect(service.delete(nonExistentId)).rejects.toThrow(NotFoundException);
    });
  });
  describe('getSchedulesByUserId', () => {
    it('should return schedules for a valid userId', async () => {
      const userId = 'a1499bda-e94d-4c97-8dee-ac1b2708a76f';
      const prismaSchedules = [
        {
          id: 'a1499bda-e94d-4c97-8dee-ac1b2708a76f',
          userId: userId,
          hour: 8,
          minute: 0,
        },
        {
          id: '3d11406f-b677-42d3-a597-c975402ff2d2',
          userId: userId,
          hour: 12,
          minute: 30,
        },
      ];
      const expectedSchedules = [
        { id: 'a1499bda-e94d-4c97-8dee-ac1b2708a76f', hour: 8, minute: 0 },
        { id: '3d11406f-b677-42d3-a597-c975402ff2d2', hour: 12, minute: 30 },
      ];

      jest
        .spyOn(mockPrisma.schedule, 'findMany')
        .mockResolvedValue(prismaSchedules);

      const schedules = await service.getSchedulesByUserId(userId);

      expect(schedules).toEqual(expectedSchedules);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          hour: true,
          minute: true,
        },
        orderBy: [{ hour: 'asc' }, { minute: 'asc' }],
      });
    });

    it('should return an empty array for a userId with no schedules', async () => {
      const userId = '1937f86d-fce7-4ee6-88af-14df7bddce4a';

      jest.spyOn(mockPrisma.schedule, 'findMany').mockResolvedValue([]);

      const schedules = await service.getSchedulesByUserId(userId);

      expect(schedules).toEqual([]);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
        },
        select: {
          id: true,
          hour: true,
          minute: true,
        },
        orderBy: [{ hour: 'asc' }, { minute: 'asc' }],
      });
    });
  });
});
