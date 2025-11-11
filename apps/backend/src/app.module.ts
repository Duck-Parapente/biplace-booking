import { EVENT_EMITTER } from '@app.di-tokens';
import { EventEmitter } from '@libs/events/database/event-emitter';
import { JwtStrategy } from '@libs/guards/jwt.strategy';
import { PackModule } from '@modules/pack/pack.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'nestjs-pino';

import { HealthController } from './health.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'info',
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    UserModule,
    PackModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [HealthController],
  providers: [JwtStrategy, { provide: EVENT_EMITTER, useClass: EventEmitter }],
})
export class AppModule {}
