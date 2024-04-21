import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryService } from './game-history.service';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistory, GameType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('GameHistoryService', () => {
  let service: GameHistoryService;
  let prismaService: PrismaService;
  const mockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameHistoryService,
        {
          provide: PrismaService,
          useValue: {
            gameHistory: {
              create: mockFn,
              findFirst: mockFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<GameHistoryService>(GameHistoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGameHistory', () => {
    it('should create a game history record', async () => {
      const gameHistoryData = {
        gameType: GameType.JUMP_N_JUMP,
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const expected = { ...gameHistoryData, id: expect.any(Number) };
      mockFn.mockReturnValue(expected);
      const result = await service.create(gameHistoryData);

      expect(result).toEqual(expected);
      expect(prismaService.gameHistory.create).toHaveBeenCalledTimes(1);
      expect(prismaService.gameHistory.create).toHaveBeenCalledWith({
        data: gameHistoryData,
      });
    });
  });
  
  describe('get high score', () => {
    it('should return the highest score for a valid game type and user ID', async () => {
      const mockGameHistory: GameHistory = {
        id: '1',
        userId: 'user123',
        gameType: 'PUZZLE',
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
      };
      
      mockFn.mockReturnValue(mockGameHistory)
      const result = await service.getHighScore('PUZZLE', 'user123');
  
      expect(result.id).toEqual(mockGameHistory.id);
      expect(result.userId).toEqual(mockGameHistory.userId);
      expect(result.gameType).toEqual(mockGameHistory.gameType);
      expect(result.score).toEqual(mockGameHistory.score);
      expect(result.startTime).toEqual(mockGameHistory.startTime);
      expect(result.endTime).toEqual(mockGameHistory.endTime);
    });
  
    it('should throw BadRequestException for an invalid game type', async () => {
      const userId = 'user123';
      const gameType = 'INVALID';
      
      await expect(service.getHighScore(gameType, userId)).rejects.toThrow(
        BadRequestException
      );
    });
  
    it('should return null if no game history found', async () => {
      const userId = 'user123';
      const gameType = 'JUMP_N_JUMP';
  
      mockFn.mockReturnValue(null)
      const result = await service.getHighScore(gameType, userId);
  
      expect(result).toBeNull();
    });
  })
});
