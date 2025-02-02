import { Injectable } from '@nestjs/common';

@Injectable()
export class AppRepository {
  getProducts(): string {
    return 'OK nhe';
  }
}
