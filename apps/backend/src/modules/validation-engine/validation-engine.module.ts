import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { Module } from '@nestjs/common';

import { EmailNotificationAdapter } from './providers/email-notification.adapter';
import { AttibutePackCliController } from './commands/attribute-packs.cli.controller';
import { AttributePacksService } from './commands/attribute-packs.service';
import { AttributionDomainService } from './domain/attribution.domain-service';
import { NOTIFICATION_PORT } from './validation-engine.di-tokens';

@Module({
  imports: [PackModule, ReservationModule],
  controllers: [],
  providers: [
    AttibutePackCliController,
    AttributionDomainService,
    AttributePacksService,
    {
      provide: NOTIFICATION_PORT,
      useClass: EmailNotificationAdapter,
    },
  ],
})
export class ValidationEngineModule {}
