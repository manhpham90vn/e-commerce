import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api/product_service/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHello(): string {
    return this.appService.getHello();
  }
}
