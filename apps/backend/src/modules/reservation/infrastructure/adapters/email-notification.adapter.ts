import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { MailClient } from '@libs/mail/mail.client';
import { ReservationWishNotificationPort } from '@modules/reservation/domain/ports/reservation-wish-notification.port';
import { Injectable, Logger } from '@nestjs/common';

const TEMPLATE_CONFIRMATION = 'reservation_wish_confirmed';
const TEMPLATE_REFUSAL = 'reservation_wish_refused';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

@Injectable()
export class EmailNotificationAdapter implements ReservationWishNotificationPort {
  private readonly logger = new Logger(EmailNotificationAdapter.name);

  constructor(private readonly mailClient: MailClient) {}

  async notifyConfirmation(reservationWishId: UUID): Promise<void> {
    await this.sendNotificationEmail(reservationWishId, TEMPLATE_CONFIRMATION);
  }

  async notifyRefusal(reservationWishId: UUID): Promise<void> {
    await this.sendNotificationEmail(reservationWishId, TEMPLATE_REFUSAL);
  }

  private async sendNotificationEmail(reservationWishId: UUID, template: string): Promise<void> {
    this.logger.log(
      `sendNotificationEmail called for ${reservationWishId.uuid} with template ${template}`,
    );

    try {
      // TODO: create a command handler to fetch reservation wish details
      // This handler should be listening to reservation wish events
      const { reservation, user, startingDate } = await prisma.reservationWish.findUniqueOrThrow({
        where: { id: reservationWishId.uuid },
        include: {
          user: true,
          reservation: {
            select: {
              user: true,
              pack: true,
              startingDate: true,
            },
          },
        },
      });

      await this.mailClient.sendTemplate({
        to: user.email,
        template,
        variables: {
          nickname: user.firstName || '',
          startingDateLabel: formatDate(startingDate),
          selectedPackLabel: reservation?.pack.label,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ${template} email: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
