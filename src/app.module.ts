import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [    ConfigModule.forRoot({ isGlobal: true }),  // Регистрируем глобальный модуль конфигурации
    PrismaModule, ProductsModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
