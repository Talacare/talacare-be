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
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@test.com';
      mockFn.mockResolvedValue([
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

      const response = await service.exportGameData(userId, email);

      expect(prismaService.gameHistory.findMany).toHaveBeenCalledWith({
        where: { userId: userId },
      });

      expect(service.setup).toHaveBeenCalled();

      expect(response).toEqual('Exported data succesfully sent to email');
    });

    it('should handle error scenario when exporting data fails', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@test.com';

      mockFn.mockResolvedValue([
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
          sendMail: jest
            .fn()
            .mockRejectedValue(new Error('Sending email failed')),
        },
      });

      const response = await service.exportGameData(userId, email);

      // Assert that response indicates failure
      expect(response).toEqual('Export data failed');
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
