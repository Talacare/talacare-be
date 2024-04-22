import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryController } from './game-history.controller';
import { GameType } from '@prisma/client';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history-dto';
import { HttpStatus } from '@nestjs/common';
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
      };
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const request = { id: userId } as CustomRequest;

      const expectedResult = {
        ...gameHistoryDto,
        userId: userId,
        id: expect.any(String),
      };

      jest
        .spyOn(gameHistoryService, 'create')
        .mockResolvedValue(expectedResult);
      jest.spyOn(responseUtil, 'response');

      const result = await controller.create(request, gameHistoryDto);

      expect(result.responseCode).toEqual(HttpStatus.CREATED);
      expect(result.responseStatus).toEqual('SUCCESS');
      expect(result.responseMessage).toEqual(
        'Game history created successfully',
      );
      expect(result.data).toEqual(expectedResult);
      expect(gameHistoryService.create).toHaveBeenCalledWith(
        userId,
        gameHistoryDto,
      );
    });

    it('should handle error when creating game history', async () => {
      const gameHistoryDto: CreateGameHistoryDto = {
        gameType: 'PUZZLE',
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
      };

      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const request = { id: userId } as CustomRequest;

      const errorMessage = 'Failed to create game history';
      jest
        .spyOn(gameHistoryService, 'create')
        .mockRejectedValue(new Error(errorMessage));
      jest.spyOn(responseUtil, 'response');

      const result = await controller.create(request, gameHistoryDto);

      expect(result.responseCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.responseStatus).toEqual('FAILED');
      expect(result.responseMessage).toEqual('Failed to create game history');
    });
  });
});
