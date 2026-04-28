import { CreatePackNoteCommand } from '@modules/pack/application/commands/create-pack-note/create-pack-note.command';
import { CreatePackNoteService } from '@modules/pack/application/commands/create-pack-note/create-pack-note.service';
import { ReservationClosedDomainEvent } from '@modules/reservation/domain/events/reservation-closed.domain-event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationClosedDomainEvent)
export class PackReservationClosedEventHandler
  implements IEventHandler<ReservationClosedDomainEvent>
{
  private readonly logger = new Logger(PackReservationClosedEventHandler.name);

  constructor(private readonly createPackNoteService: CreatePackNoteService) {}

  async handle({
    userId,
    reservation,
    packNote,
    metadata,
  }: ReservationClosedDomainEvent): Promise<void> {
    if (!packNote || !userId) return;

    try {
      await this.createPackNoteService.execute(
        new CreatePackNoteCommand({
          props: {
            packId: reservation.packId,
            content: packNote,
            createdById: userId,
            createdAt: reservation.startingDate,
          },
          metadata,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Error creating pack note on reservation closed: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
