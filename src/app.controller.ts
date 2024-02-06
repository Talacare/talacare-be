import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<User[]> {
    return await this.appService.getHello();
  }

  @Get('/environment')
  async getEnvironment(): Promise<string> {
    return await this.appService.getEnvironment();
  }

  @Post()
  async postUser(@Body('email') email: string): Promise<User> {
    return await this.appService.postUser(email);
  }
}
