import { JwtStrategy } from '@libs/guards/jwt.strategy';
import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'nestjs-pino';

import { HealthController } from './health.controller';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'info',
        serializers: {
          req: (req) => ({
            ...req,
            headers: {
              ...req.headers,
              authorization: req.headers.authorization ? '[REDACTED]' : undefined,
            },
          }),
        },
      },
    }),
    UserModule,
    PackModule,
    ReservationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule {}
