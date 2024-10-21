
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Используем require для подключения библиотеки Telegram
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: any;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_TOKEN');
    this.bot = new TelegramBot(token, { polling: true });

    // При первом сообщении отправляем главное меню
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      this.sendMainMenu(chatId);
    });

    // Запуск обработки кнопок
    this.handleButtonPress();
  }

  // Функция для отправки главного меню
  sendMainMenu(chatId: number) {
    const message = `Добро пожаловать в Game Propaganda 💚\n\nМы работаем турецким и индийским регионом, оформляем подписки Sony Playstation Plus, GamePass, EA Play и покупаем для тебя любые игры, ведь у нас полный каталог игр Sony. Сохраним прогресс на старом аккаунте, а если хочешь — создадим новый.\n\n➡️ Подпишись на новости и прочитай отзывы о нас — https://t.me/sonyplaystationpluss/46\n\n🚨 Работаем каждый день 24/7`;
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Перейти в магазин', callback_data: 'go_to_store' },
            { text: 'Меню', callback_data: 'menu' },
          ],
          [
            { text: 'Прочитать отзывы', callback_data: 'feedback' },
          ],
        ],
      },
    };

    this.bot.sendMessage(chatId, message, options);
  }

  // Функция для обработки нажатий на кнопки
  handleButtonPress() {
    this.bot.on('callback_query', (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      // Обработка главных кнопок
      if (data === 'go_to_store') {
        this.bot.sendMessage(chatId, 'Вы перешли в магазин...');
        // Логика для перенаправления пользователя на магазин
      } else if (data === 'menu') {
        this.sendSubMenu(chatId); // Отправляем подменю с доп. опциями
      } else if (data === 'feedback') {
        this.bot.sendMessage(chatId, 'Спасибо за отзыв!');
      }

      // Обработка подменю
      else if (data === 'get_order') {
        this.bot.sendMessage(chatId, 'Ваш заказ обрабатывается...');
        this.sendOrderConfirmation(chatId, '137024', 6099); // Пример заказа
      } else if (data === 'call_operator') {
        this.sendOperatorCall(chatId); // Вызов оператора
      } else if (data === 'get_prices') {
        this.bot.sendMessage(chatId, 'Узнайте актуальные цены на подписки по ссылке: https://playstationplus.store/#table');
      } else if (data === 'news') {
        this.bot.sendMessage(chatId, 'Новости Game Propaganda: https://t.me/gamepropaganda_news');
      }

      // Обработка заказа и оплаты
      else if (data === 'pay') {
        this.bot.sendMessage(chatId, 'Перенаправляем вас на страницу оплаты...');
        // Логика для перенаправления на оплату
      } else if (data === 'remind') {
        this.bot.sendMessage(chatId, 'Напоминаем вам, что заказ все еще доступен для оплаты.');
      }
    });
  }

  // Подменю с дополнительными опциями
  sendSubMenu(chatId: number) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Получить заказ', callback_data: 'get_order' },
            { text: 'Вызвать оператора', callback_data: 'call_operator' },
          ],
          [
            { text: 'Узнать цены', callback_data: 'get_prices' },
            { text: 'Новости от GP', callback_data: 'news' },
          ],
        ],
      },
    };

    this.bot.sendMessage(chatId, 'В боте ты можешь:', options);
  }

  // Сообщение с подтверждением заказа
  sendOrderConfirmation(chatId: number, orderId: string, totalAmount: number) {
    const message = `Бот сформировал ваш заказ №${orderId}.\n\nИтоговая сумма: ${totalAmount}₽`;
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Оплатить', callback_data: 'pay' }],
          [{ text: 'Не оплатил за 20 минут', callback_data: 'remind' }]
        ],
      },
    };

    this.bot.sendMessage(chatId, message, options);
  }

  // Функция для вызова оператора через систему HelpDesk
  sendOperatorCall(chatId: number) {
    this.bot.sendMessage(chatId, 'Мы получили ваше обращение, вам ответит первый освободившийся оператор.');

    // Логика для отправки запроса в систему HelpDesk
    this.sendToHelpDesk(chatId, 'Пользователь вызвал оператора');
  }

  // Пример API-запроса к системе поддержки (HelpDesk)
  sendToHelpDesk(chatId: number, message: string) {
    // Логика интеграции с системой поддержки, например, через HTTP-запрос
    // axios.post('https://helpdesk.example.com/tickets', { chatId, message });
  }

  // Пример отправки ссылки на корзину или оплату
  sendCartLink(chatId: number) {
    this.bot.sendMessage(chatId, 'Открыть корзину', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть корзину', url: 'https://your-web-app.com/cart' }]
        ]
      }
    });
  }
}
