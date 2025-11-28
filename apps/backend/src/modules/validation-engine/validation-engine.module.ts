import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { Module } from '@nestjs/common';

import { AttributePacksService } from './application/commands/attribute-packs/attribute-packs.handler';
import { AttributionDomainService } from './domain/attribution.domain-service';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';
import { AttibutePackCliController } from './infrastructure/cli/attribute-packs.cli.controller';
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
