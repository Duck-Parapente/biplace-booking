import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'info',
        quietReqLogger: true,
        quietResLogger: true,
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
