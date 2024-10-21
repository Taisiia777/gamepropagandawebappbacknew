import { Controller, Get, Query, Param  } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Get('price-range/1-500')
  async getProductsInPriceRange() {
    return this.ProductsService.getProductsInPriceRange(1, 500);
  }

  @Get('top-rated')
  async getTopRatedProducts() {
    return this.ProductsService.getTopRatedProducts();
  }
  @Get()
  async getProducts(@Query('page') page = 1, @Query('name') name?: string) {
    if (name) {
      return this.ProductsService.searchProductsByName(name);
    }
    return this.ProductsService.getPaginatedProducts(Number(page));
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
  async getProductsByCategory(
    @Param('category') category: string,
    @Query('page') page = 1,
  ) {
    return this.ProductsService.getProductsByCategory(category, Number(page));
  }
}
