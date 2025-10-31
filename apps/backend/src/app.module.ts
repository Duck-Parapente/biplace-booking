import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'info',
        quietReqLogger: true,
        quietResLogger: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
