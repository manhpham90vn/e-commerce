import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProductDto } from './dtos/createProduct';

@Controller('/api/product_service/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  health(): string {
    return 'OK';
  }

  @Get('/products')
  getProducts(): string {
    return this.appService.getProducts();
  }

  @Get('/products/:id')
  getProductById(@Param('id') id: string): string {
    return id;
  }

  @Post('/products')
  createProduct(@Body() body: CreateProductDto): string {
    return body.name;
  }

  @Post('/products/:id')
  updateProduct(@Param('id') id: string): string {
    return id;
  }
}
