import { ExportDataService } from './export-data.service';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GameType } from '@prisma/client';
import { ResponseUtil } from '../common/utils/response.util';
import { ForbiddenException } from '@nestjs/common';

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
    it('should throw ForbiddenException when user is not admin', async () => {
      const email = 'test@test.com';
      const role = 'USER';

      const testFunction = async () => {
        await service.exportGameData(email, role);
      };

      await expect(testFunction).rejects.toThrowError(ForbiddenException);
    });

    it('should generate and send email with game history for admin user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'test@test.com';
      const role = 'ADMIN';

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

      const response = await service.exportGameData(email, role);

      expect(prismaService.gameHistory.findMany).toHaveBeenCalledWith({
        orderBy: {
          gameType: 'asc',
        },
      });

      expect(service.setup).toHaveBeenCalled();

      expect(response).toEqual('Exported data successfully sent to email');
    });

    it('should handle error scenario when exporting data fails', async () => {
      const email = 'test@test.com';
      const role = 'ADMIN';

      service.setup = jest.fn().mockReturnValue({
        transporter: {
          sendMail: jest
            .fn()
            .mockRejectedValue(new Error('Sending email failed')),
        },
      });

      const response = await service.exportGameData(email, role);

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
