import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history-dto';
import { ResponseUtil } from '../common/utils/response.util';

@Controller('game-history')
export class GameHistoryController {
  constructor(
    private readonly gameHistoryService: GameHistoryService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createGameHistoryDto: CreateGameHistoryDto,
  ): Promise<any> {
    try {
      const result = await this.gameHistoryService.create(createGameHistoryDto);
      return this.responseUtil.response(
        {
          responseMessage: 'Game history created successfully',
          responseCode: HttpStatus.CREATED,
        },
        { data: result },
      );
    } catch (error) {
      return this.responseUtil.response(
        {
          responseMessage: 'Failed to create game history',
          responseCode: HttpStatus.INTERNAL_SERVER_ERROR,
          responseStatus: 'FAILED',
        },
        { error: error.message },
      );
    }
  }
}
