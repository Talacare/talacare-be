import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ExportDataService } from './export-data.service';
import { ResponseUtil } from 'src/common/utils/response.util';

@Controller('export-data')
export class ExportDataController {
  constructor(private readonly exportDataService: ExportDataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async export(@Req() request: Request): Promise<string> {
    return await this.exportDataService.generate();
  }
}
