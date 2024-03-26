import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryService } from './game-history.service';
import { PrismaService } from '../prisma/prisma.service';
import { GameType } from '@prisma/client';

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
});
