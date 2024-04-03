import { Test, TestingModule } from '@nestjs/testing';
import { ExportDataController } from './export-data.controller';
import { ExportDataService } from './export-data.service';
import { ResponseUtil } from '../common/utils/response.util';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistoryService } from '../game-history/game-history.service';

describe('ExportDataController', () => {
  let controller: ExportDataController;
  let exportDataService: ExportDataService;
  let gameHistoryService: GameHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportDataController],
      providers: [ExportDataService, ResponseUtil, PrismaService],
    }).compile();

    controller = module.get<ExportDataController>(ExportDataController);
    exportDataService = module.get<ExportDataService>(ExportDataService);
    gameHistoryService = module.get<GameHistoryService>(GameHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('export', () => {
  //   it('should call generate method of ExportDataService and return the result', async () => {
  //     const expectedResult = 'Game data succesfully sent to email';
  //     jest
  //       .spyOn(exportDataService, 'exportGameData')
  //       .mockResolvedValue(expectedResult);

  //     const result = await controller.export({} as any);

  //     // expect(result).toBe();
  //     expect(exportDataService.exportGameData).toHaveBeenCalled();
  //   });
  // });
});
