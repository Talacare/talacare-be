import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryController } from './game-history.controller';
import { GameType } from '@prisma/client';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history-dto';

const mockGameHistoryService = {
  create: jest.fn((dto) => {
    return { id: Date.now(), ...dto };
  }),
};

describe('GameHistoryController', () => {
  let controller: GameHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameHistoryController],
      providers: [
        {
          provide: GameHistoryService,
          useValue: mockGameHistoryService,
        },
      ],
    }).compile();

    controller = module.get<GameHistoryController>(GameHistoryController);
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

      await expect(controller.create(gameHistoryDto)).resolves.toEqual({
        id: expect.any(Number),
        ...gameHistoryDto,
      });

      expect(mockGameHistoryService.create).toHaveBeenCalledWith(
        gameHistoryDto,
      );
    });
  });
});
