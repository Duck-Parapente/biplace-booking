import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import 'newrelic';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.use(json({ limit: '10mb' }));
  await app.listen(parseInt(process.env.PORT || '3001', 10));
  console.log('Backend started on', process.env.PORT || 3001);
}
bootstrap();
