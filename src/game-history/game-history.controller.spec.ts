import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryController } from './game-history.controller';
import { GameHistory, GameType } from '@prisma/client';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history-dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ResponseUtil } from '../common/utils/response.util';
import { PrismaService } from '../prisma/prisma.service';
import { CustomRequest } from 'src/common/interfaces/request.interface';

describe('GameHistoryController', () => {
  let controller: GameHistoryController;
  let gameHistoryService: GameHistoryService;
  let responseUtil: ResponseUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameHistoryController],
      providers: [GameHistoryService, ResponseUtil, PrismaService],
    }).compile();

    controller = module.get<GameHistoryController>(GameHistoryController);
    gameHistoryService = module.get<GameHistoryService>(GameHistoryService);
    responseUtil = module.get<ResponseUtil>(ResponseUtil);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new game history record', async () => {
      const gameHistoryDto: CreateGameHistoryDto = {
        gameType: GameType.PUZZLE,
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResult = {
        ...gameHistoryDto,
        id: expect.any(String),
      };

      jest
        .spyOn(gameHistoryService, 'create')
        .mockResolvedValue(expectedResult);
      jest.spyOn(responseUtil, 'response');

      const result = await controller.create(gameHistoryDto);

      expect(result.responseCode).toEqual(HttpStatus.CREATED);
      expect(result.responseStatus).toEqual('SUCCESS');
      expect(result.responseMessage).toEqual(
        'Game history created successfully',
      );
      expect(result.data).toEqual(expectedResult);
      expect(gameHistoryService.create).toHaveBeenCalledWith(gameHistoryDto);
    });

    it('should handle error when creating game history', async () => {
      const gameHistoryDto: CreateGameHistoryDto = {
        gameType: 'PUZZLE',
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const errorMessage = 'Failed to create game history';
      jest
        .spyOn(gameHistoryService, 'create')
        .mockRejectedValue(new Error(errorMessage));
      jest.spyOn(responseUtil, 'response');

      const result = await controller.create(gameHistoryDto);

      expect(result.responseCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.responseStatus).toEqual('FAILED');
      expect(result.responseMessage).toEqual('Failed to create game history');
    });
  });

  describe('getHighScore', () => {
    const mockCustomRequest: CustomRequest = {
      id: 'user123',
    } as unknown as CustomRequest

    it('should return the high score for a valid game type', async () => {
      const gameType = 'PUZZLE';
      const expectedResult: GameHistory = {
        id: '1',
        userId: 'user123',
        gameType: 'PUZZLE',
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
      };

      jest.spyOn(gameHistoryService, 'getHighScore').mockResolvedValue(expectedResult);
      jest.spyOn(responseUtil, 'response');

      const result = await controller.getHighScore(gameType, mockCustomRequest);

      expect(result.data).toEqual(expectedResult);
      expect(result.responseCode).toEqual(HttpStatus.OK);
      expect(result.responseStatus).toEqual('SUCCESS');
      expect(result.responseMessage).toEqual('Data retrieved successfully');
      expect(gameHistoryService.getHighScore).toHaveBeenCalledWith(gameType, 'user123');
      expect(responseUtil.response).toHaveBeenCalledWith({}, { data: expectedResult });
    });

    it('should handle invalid game type', async () => {
      const gameType = 'INVALID';

      jest.spyOn(gameHistoryService, 'getHighScore').mockRejectedValue(new BadRequestException());

      await expect(controller.getHighScore(gameType, mockCustomRequest)).rejects.toThrow(BadRequestException);
      expect(gameHistoryService.getHighScore).toHaveBeenCalledWith(gameType, 'user123');
    });

    it('should return null if no game history found', async () => {
      const gameType = 'PUZZLE';

      jest.spyOn(gameHistoryService, 'getHighScore').mockResolvedValue(null);
      jest.spyOn(responseUtil, 'response');

      const result = await controller.getHighScore(gameType, mockCustomRequest);

      expect(result.data).toBeNull();
      expect(result.responseCode).toEqual(HttpStatus.OK);
      expect(result.responseStatus).toEqual('SUCCESS');
      expect(result.responseMessage).toEqual('Data retrieved successfully');
      expect(gameHistoryService.getHighScore).toHaveBeenCalledWith(gameType, 'user123');
      expect(responseUtil.response).toHaveBeenCalledWith({}, { data: null });
    });
  });
});
