// src/products/products.service.ts
import { Injectable, BadRequestException, NotFoundException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Service } from '@prisma/client'; // Импортируем перечисление Service из Prisma

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      take: 10, // Ограничение на получение только 10 записей
    });
    // Преобразуем поля BigInt в строку
    return products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }
  async searchProductsByName(name: string) {
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    return products.map((product) => ({ ...product, id: product.id.toString() }));
  }
  async getAllSubscriptions() {
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: 'Mortal', // Фильтр для поиска "Xbox" в названии
          mode: 'insensitive', // Опционально: делает поиск регистронезависимым
        },
      },
    });
    // Преобразуем поля BigInt в строку
    return products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }
  // Новый метод для получения товара по id
  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: BigInt(id) },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return {
      ...product,
      id: product.id.toString(),
    };
  }
}
