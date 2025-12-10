import { ReservationCancelledDomainEvent } from '@modules/reservation/domain/events/reservation-cancelled.domain-event';
import { ReservationClosedDomainEvent } from '@modules/reservation/domain/events/reservation-closed.domain-event';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { USER_REPOSITORY } from '@modules/user/user.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationCancelledDomainEvent, ReservationClosedDomainEvent)
export class ReservationEndedEventHandler
  implements IEventHandler<ReservationCancelledDomainEvent | ReservationClosedDomainEvent>
{
  private readonly logger = new Logger(ReservationEndedEventHandler.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async handle({
    aggregateId,
    id,
    userId,
    metadata,
  }: ReservationCancelledDomainEvent | ReservationClosedDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `Handling event ${id.uuid} for reservation ${aggregateId.uuid}`,
        eventId: id.uuid,
        reservationId: aggregateId.uuid,
        userId: userId?.uuid,
        metadata: metadata,
      });

      if (!userId) {
        this.logger.warn(`No userId provided in ReservationCancelledDomainEvent ${id.uuid}`);
        return;
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logger.error(`User not found: ${userId.uuid}`);
        return;
      }

      const currentScore = await this.userRepository.getTwelveMonthUserScore(userId);

      this.logger.log(`Update score for user ${userId.uuid} to ${currentScore.value}`);
      user.setCurrentScore(currentScore);
      await this.userRepository.update(user);

      this.logger.log(`Successfully updated score for user ${userId.uuid}`);
    } catch (error) {
      this.logger.error(
        `Error in ReservationEndedEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
