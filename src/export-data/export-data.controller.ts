import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ExportDataService } from './export-data.service';
import { ResponseUtil } from '../common/utils/response.util';
import { CustomRequest } from '../common/interfaces/request.interface';

@Controller('export-data')
export class ExportDataController {
  constructor(
    private readonly exportDataService: ExportDataService,
    private responseUtil: ResponseUtil,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async export(@Req() request: CustomRequest): Promise<string> {
    return this.responseUtil.response({
      responseMessage: await this.exportDataService.exportGameData(
        request.id,
        request.email,
      ),
    });
  }
}
