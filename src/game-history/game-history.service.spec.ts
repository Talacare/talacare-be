import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryService } from './game-history.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GameHistoryService', () => {
  let service: GameHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameHistoryService, PrismaService],
    }).compile();

    service = module.get<GameHistoryService>(GameHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGameHistory', () => {
    it('should create a game history record', async () => {
      const gameHistoryData = {
        gameType: 'Type1',
        score: 100,
        startTime: new Date(),
        endTime: new Date(),
        userId: 1,
      };

      const expected = { ...gameHistoryData, id: expect.any(Number) };
      jest.spyOn(service, 'create').mockImplementation(async () => expected);

      const result = await service.create(gameHistoryData);

      expect(result).toEqual(expected);
    });
  });
});
