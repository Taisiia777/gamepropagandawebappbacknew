import { Controller, Get, Query, Param  } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Get()
  async getProducts(@Query('name') name?: string) {
    if (name) {
      return this.ProductsService.searchProductsByName(name);
    }
    return this.ProductsService.getAllProducts();
  }
  @Get('subscriptions')
  async getAllSubscriptions() {
    return this.ProductsService.getAllSubscriptions();
  }
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.ProductsService.getProductById(id);
  }
  @Get('category/:category')
  async getProductsByCategory(@Param('category') category: string) {
    return this.ProductsService.getProductsByCategory(category);
  }
}
