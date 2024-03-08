import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history-dto';
import { GameHistory } from '@prisma/client';

@Controller('game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createGameHistoryDto: CreateGameHistoryDto,
  ): Promise<GameHistory> {
    return this.gameHistoryService.create(createGameHistoryDto);
  }
}
