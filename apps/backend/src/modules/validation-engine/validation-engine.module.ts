import { EventEmitter } from '@libs/database/helpers/event-emitter';
import { EVENT_EMITTER } from '@libs/events/domain/event-emitter.di-tokens';
import { PackModule } from '@modules/pack/pack.module';
import { ReservationModule } from '@modules/reservation/reservation.module';
import { Module } from '@nestjs/common';

import { AttributePacksService } from './application/commands/attribute-packs/attribute-packs.service';
import { AttributionExplanationHtmlDomainService } from './domain/attribution-explanation-html.domain-service';
import { AttributionDomainService } from './domain/attribution.domain-service';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';
import { AttibutePackCliController } from './infrastructure/cli/attribute-packs.cli.controller';
import { NOTIFICATION_PORT } from './validation-engine.di-tokens';

@Module({
  imports: [ReservationModule, PackModule],
  controllers: [],
  providers: [
    AttibutePackCliController,
    AttributionDomainService,
    AttributionExplanationHtmlDomainService,
    AttributePacksService,
    {
      provide: NOTIFICATION_PORT,
      useClass: EmailNotificationAdapter,
    },
    { provide: EVENT_EMITTER, useClass: EventEmitter },
  ],
})
export class ValidationEngineModule {}
