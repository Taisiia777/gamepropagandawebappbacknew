
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated/local';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async createUser(email: string, name: string, password: string) {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  // Метод для получения товаров из вишлиста пользователя
  async getWishlistItems(userId: string) {
    return await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true }, // Подключите информацию о продукте
    });
  }

  async handleAbandonedCart(userId: string) {
    const cart = await this.getUserCart(userId);
    const lastInteractionTime = await this.getLastInteractionTime(userId);

    if (Date.now() - lastInteractionTime >= 15 * 60 * 1000 && cart.length > 0) {
      await this.sendTelegramMessage(userId, {
        text: 'Бот сохранил игры, которые вы положили в корзину. Вы можете продолжить оформление заказа в любой удобный момент, хоть прямо сейчас.',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Открыть корзину', web_app: { url: 'https://yourapp.com/cart' } }]
          ],
        },
      });
    }
  }

  async sendTelegramMessage(userId: string, message: any) {
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: userId, ...message }),
    });
  }

  // Триггер для проверки скидок на товары в вишлисте
  async checkWishlistDiscounts(userId: string) {
    const wishlistItems = await this.getWishlistItems(userId);

    const discountedItems = wishlistItems
      .filter(item =>
        item.product.discounted_price &&
        item.product.base_price &&
        (item.product.base_price - item.product.discounted_price) / item.product.base_price >= 0.1
      )
      .map(item => ({
        name: item.product.name,
        platform: item.product.platform,
        newPrice: item.product.discounted_price,
        discount: Math.round(((item.product.base_price - item.product.discounted_price) / item.product.base_price) * 100),
      }));

    if (discountedItems.length > 0) {
      const discountMessage = discountedItems
        .map(item => `- ${item.name} [${item.platform}] — ${item.newPrice} ₽ (-${item.discount}%)`)
        .join('\n');

      await this.sendTelegramMessage(userId, {
        text: `Игры из твоего вишлиста теперь со скидкой, успей купить\n${discountMessage}`,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Открыть вишлист', web_app: { url: 'https://yourapp.com/wishlist' } }],
          ],
        },
      });
    }
  }

  // Примерные заглушки для getUserCart и getLastInteractionTime
  async getUserCart(userId: string) {
    // Здесь логика получения товаров в корзине пользователя
    return [];
  }

  async getLastInteractionTime(userId: string) {
    // Здесь логика получения последнего времени взаимодействия пользователя
    return Date.now();
  }
}
