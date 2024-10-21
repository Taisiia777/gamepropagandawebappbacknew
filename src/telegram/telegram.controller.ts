// src/telegram/telegram.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('sendMenu')
  async sendMenu(@Body('chatId') chatId: number) {
    this.telegramService.sendMainMenu(chatId);
    return { message: 'Main menu sent' };
  }
}
