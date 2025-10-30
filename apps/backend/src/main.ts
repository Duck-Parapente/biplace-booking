import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { json } from 'express';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

// 👇 Load your custom .env file
const envPath = dotenv.config({ path: join(__dirname, '..', '..', '..', 'infra', '.env') });
console.log(envPath);
import 'newrelic';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(json({ limit: '10mb' }));
  await app.listen(parseInt(process.env.PORT || '3001', 10));
  console.log('Backend started on', process.env.PORT || 3001);
}
bootstrap();
