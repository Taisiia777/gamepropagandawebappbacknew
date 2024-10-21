import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [ConfigModule],  // Добавляем ConfigModule
  providers: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
