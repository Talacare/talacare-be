import { ExportDataService } from './export-data.service';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GameType } from '@prisma/client';
import { ResponseUtil } from '../common/utils/response.util';

describe('ExportDataService', () => {
  let service: ExportDataService;
  let prismaService: PrismaService;

  const mockFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportDataService,
        ResponseUtil,
        {
          provide: PrismaService,
          useValue: {
            gameHistory: {
              findMany: mockFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<ExportDataService>(ExportDataService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('generate', () => {
    it('should generate and send email with game history', async () => {
      mockFn.mockResolvedValue([
        {
          gameType: GameType.JUMP_N_JUMP,
          score: 100,
          startTime: new Date(),
          endTime: new Date(),
          userId: '123e4567-e89b-12d3-a456-426614174000',
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

      const response = await service.generate();

      expect(prismaService.gameHistory.findMany).toHaveBeenCalledWith({
        where: { userId: '27caaf57-b0b6-412a-9f95-c6beec2d0aaf' },
      });

      expect(service.setup).toHaveBeenCalled();

      expect(response).toEqual({
        responseCode: 200,
        responseMessage: 'mail response',
        responseStatus: 'SUCCESS',
      });
    });

    it('should throw error if any operation fails', async () => {
      mockFn.mockRejectedValue(new Error('Failed to fetch game history'));

      await expect(service.generate()).rejects.toThrowError(
        'Failed to fetch game history',
      );
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
