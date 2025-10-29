import { NestFactory } from '@nestjs/core';
import { json } from 'express';

import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '10mb' }));
  await app.listen(parseInt(process.env.PORT || '3001', 10));
  console.log('Backend started on', process.env.PORT || 3001);
}
bootstrap();
