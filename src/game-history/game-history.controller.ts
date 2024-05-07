import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history-dto';
import { ResponseUtil } from '../common/utils/response.util';
import { CustomRequest } from 'src/common/interfaces/request.interface';

@Controller('game-history')
export class GameHistoryController {
  constructor(
    private readonly gameHistoryService: GameHistoryService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: CustomRequest,
    @Body() createGameHistoryDto: CreateGameHistoryDto,
  ): Promise<any> {
    try {
      const userId = request.id.toString();
      const result = await this.gameHistoryService.create(
        userId,
        createGameHistoryDto,
      );
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

  @Get('/high-score/:gameType')
  @HttpCode(HttpStatus.OK)
  async getHighScore(
    @Param('gameType') gameType: string,
    @Req() request: CustomRequest,
  ) {
    const userId = request.id.toString();
    const result = await this.gameHistoryService.getHighScore(gameType, userId);
    return this.responseUtil.response({}, { data: result });
  }
}
