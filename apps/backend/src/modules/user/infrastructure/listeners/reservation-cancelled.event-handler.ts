import { ReservationCancelledDomainEvent } from '@modules/reservation/domain/events/reservation-cancelled.domain-event';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { USER_REPOSITORY } from '@modules/user/user.di-tokens';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(ReservationCancelledDomainEvent)
export class UserScoreReservationCancelledEventHandler
  implements IEventHandler<ReservationCancelledDomainEvent>
{
  private readonly logger = new Logger(UserScoreReservationCancelledEventHandler.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async handle({
    aggregateId,
    id,
    userId,
    cost,
    metadata,
  }: ReservationCancelledDomainEvent): Promise<void> {
    try {
      this.logger.log({
        message: `${ReservationCancelledDomainEvent.name} received for user score update`,
        eventId: id.uuid,
        reservationId: aggregateId.uuid,
        userId: userId?.uuid,
        cost: cost.value,
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

      this.logger.log(`Incrementing score for user ${userId.uuid} by ${cost.value} days`);
      user.incrementScore(cost);
      await this.userRepository.update(user);

      this.logger.log(`Successfully updated score for user ${userId.uuid}`);
    } catch (error) {
      this.logger.error(
        `Error in UserScoreReservationCancelledEventHandler: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
