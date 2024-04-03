import { ExportDataService } from './export-data.service';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GameType } from '@prisma/client';
import { ResponseUtil } from '../common/utils/response.util';

describe('ExportDataService', () => {
  let service: ExportDataService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportDataService,
        ResponseUtil,

        {
          provide: PrismaService,
          useValue: {
            gameHistory: {
              getGameHistoryByUser: mockGameHistoryByUser,
            },
          },
        },
      ],
    }).compile();

    service = module.get<ExportDataService>(ExportDataService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('exportGameData', () => {
    it('should generate and send email with game history', async () => {
      const userId = 'a1499bda-e94d-4c97-8dee-ac1b2708a76d';
      mockGameHistoryByUser.mockResolvedValue([
        {
          gameType: GameType.JUMP_N_JUMP,
          score: 100,
          startTime: new Date(),
          endTime: new Date(),
          userId: userId,
        },
      ]);

      service.setup = jest.fn().mockReturnValue({
        workbook: {
          xlsx: {
            writeBuffer: jest
              .fn()
              .mockResolvedValue(Buffer.from('buffer content')),
          },
        },
        worksheet: {
          addRow: jest.fn(),
          columns: [],
        },
        transporter: {
          sendMail: jest.fn().mockResolvedValue({ response: 'mail response' }),
        },
      });

      const response = await service.exportGameData(userId);

      expect(prismaService.gameHistory.findMany).toHaveBeenCalledWith(userId);
      expect(service.setup).toHaveBeenCalled();
      expect(response).toEqual('Game data succesfully sent to email');
    });
  });

  describe('setup', () => {
    it('should return workbook, worksheet, and transporter', () => {
      const { workbook, worksheet, transporter } = service.setup();

      expect(workbook).toBeDefined();
      expect(worksheet).toBeDefined();
      expect(transporter).toBeDefined();
    });
  });
});
