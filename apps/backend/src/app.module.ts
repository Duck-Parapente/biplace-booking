import { JwtStrategy } from '@libs/guards/jwt.strategy';
import { FeatureFlagModule } from '@modules/feature-flag/feature-flag.module';
import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { UserModule } from '@modules/user/user.module';
import { ValidationEngineModule } from '@modules/validation-engine/validation-engine.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from 'nestjs-pino';

const appModules = [
  UserModule,
  PackModule,
  ReservationModule,
  ValidationEngineModule,
  FeatureFlagModule,
];

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConsoleModule,
    ...appModules,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
