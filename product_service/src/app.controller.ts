import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProductDto } from './dtos/createProduct';

@Controller('/api/product_service/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/products')
  getProducts(): string {
    return '';
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
