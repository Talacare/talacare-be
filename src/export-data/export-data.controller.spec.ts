import { Test, TestingModule } from '@nestjs/testing';
import { ExportDataController } from './export-data.controller';
import { ExportDataService } from './export-data.service';
import { ResponseUtil } from '../common/utils/response.util';
import { PrismaService } from '../prisma/prisma.service';

describe('ExportDataController', () => {
  let controller: ExportDataController;
  let exportDataService: ExportDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportDataController],
      providers: [ExportDataService, ResponseUtil, PrismaService],
    }).compile();

    controller = module.get<ExportDataController>(ExportDataController);
    exportDataService = module.get<ExportDataService>(ExportDataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('export', () => {
    it('should call generate method of ExportDataService and return the result', async () => {
      const expectedResult = 'mocked export data';
      jest
        .spyOn(exportDataService, 'generate')
        .mockResolvedValue(expectedResult);

      const result = await controller.export({} as any);

      expect(result).toBe(expectedResult);
      expect(exportDataService.generate).toHaveBeenCalled();
    });
  });
});
