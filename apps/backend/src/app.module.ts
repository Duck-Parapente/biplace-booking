import { JwtStrategy } from '@libs/guards/jwt.strategy';
import { MailModule } from '@libs/mail/mail.module';
import { FeatureFlagModule } from '@modules/feature-flag/feature-flag.module';
import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { UserModule } from '@modules/user/user.module';
import { ValidationEngineModule } from '@modules/validation-engine/validation-engine.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { ConsoleModule } from 'nestjs-console';
import { LoggerModule } from 'nestjs-pino';

const appModules = [UserModule, PackModule, ReservationModule, ValidationEngineModule];

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: 'info',
        customSuccessMessage: (req, res) => {
          return `(${res.statusCode}) ${req.method} ${req.url}`;
        },
        serializers:
          process.env.NODE_ENV === 'local'
            ? {
                req: () => undefined,
                res: () => undefined,
              }
            : {
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
    FeatureFlagModule,
    CqrsModule.forRoot(),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConsoleModule,
    ...appModules,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
