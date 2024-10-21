import { Injectable, BadRequestException, NotFoundException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Service } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async getPaginatedProducts(page: number) {
    const pageSize = 24;
    const skip = (page - 1) * pageSize;
    const products = await this.prisma.product.findMany({
      skip,
      take: pageSize,
          where: {
            base_price: {
              not: null,
            },
            platforms: {
              hasSome: ["PS4", "PS5"], // Проверяем, что платформы содержат значения "PS4" или "PS5"
            },
          },
    });
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
        base_price: {
          not: null, // Цена не должна быть null
        },
        platforms: {
          hasSome: ["PS4", "PS5"], // Проверяем, что платформы содержат значения "PS4" или "PS5"
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

  async getProductsByCategory(category: string, page: number) {
    const pageSize = 24;
    const skip = (page - 1) * pageSize;

    const products = await this.prisma.product.findMany({
      where: {
        categories: {
          has: category, // Фильтр по массиву категорий
        },
        base_price: {
          not: null, // Цена не должна быть null
        },
        platforms: {
          hasSome: ["PS4", "PS5"], // Проверяем, что платформы содержат значения "PS4" или "PS5"
        },
      },
      skip,
      take: pageSize, // Возвращаем 24 продукта на каждой странице
    });

    return products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }
  async getProductsInPriceRange(minPrice: number, maxPrice: number) {
    const products = await this.prisma.product.findMany({
      where: {
        base_price: {
          gte: minPrice,
          lte: maxPrice,
        },
        platforms: {
          hasSome: ["PS4", "PS5"], // Проверяем, что платформы содержат значения "PS4" или "PS5"
        },
      },
      take: 24,
      orderBy: {
        average_rating: 'desc', // Сортировка по average_rating по убыванию
      },
    });
    return products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }


  async getTopRatedProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        base_price: {
          not: null, // Условие: цена должна быть не null
        },
        platforms: {
          hasSome: ["PS4", "PS5"], // Проверяем, что платформы содержат значения "PS4" или "PS5"
        },
      },
      take: 24,
      orderBy: {
        average_rating: 'desc',
      },
    });
    return products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));
  }
}
