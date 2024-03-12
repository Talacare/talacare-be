import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ExportDataService } from './export-data.service';

@Controller('export-data')
export class ExportDataController {
  constructor(private readonly exportDataService: ExportDataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async export(): Promise<string> {
    return 'hello world';
  }
}
