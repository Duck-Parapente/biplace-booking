import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { MailClient } from '@libs/mail/mail.client';
import { ReservationWishNotificationPort } from '@modules/reservation/domain/ports/reservation-wish-notification.port';
import { Injectable, Logger } from '@nestjs/common';

const TEMPLATE_WISH_REFUSAL = 'reservation_wish_refused';
const TEMPLATE_WISH_CANCEL = 'reservation_wish_cancelled';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

@Injectable()
export class ReservationWishEmailNotificationAdapter implements ReservationWishNotificationPort {
  private readonly logger = new Logger(ReservationWishEmailNotificationAdapter.name);

  constructor(private readonly mailClient: MailClient) {}

  async notifyWishCancel(reservationWishId: UUID): Promise<void> {
    await this.sendWishNotificationEmail(reservationWishId, TEMPLATE_WISH_CANCEL);
  }

  async notifyWishRefusal(reservationWishId: UUID, explanationTable?: string): Promise<void> {
    await this.sendWishNotificationEmail(
      reservationWishId,
      TEMPLATE_WISH_REFUSAL,
      explanationTable,
    );
  }

  private async sendWishNotificationEmail(
    reservationWishId: UUID,
    template: string,
    explanationTable?: string,
  ): Promise<void> {
    this.logger.log(
      `sendNotificationEmail called for ${reservationWishId.uuid} with template ${template}`,
    );

    try {
      const { user, startingDate, packChoices } = await prisma.reservationWish.findUniqueOrThrow({
        where: { id: reservationWishId.uuid },
        include: {
          user: true,
          packChoices: {
            select: {
              pack: {
                select: {
                  label: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
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
          wishPacksLabels: packChoices.map(({ pack }) => pack.label).join(', '),
          explanationTable: explanationTable || '',
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
