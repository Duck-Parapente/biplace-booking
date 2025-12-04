import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { MailClient } from '@libs/mail/mail.client';
import { ReservationNotificationPort } from '@modules/reservation/domain/ports/reservation-notification.port';
import { Injectable, Logger } from '@nestjs/common';

const TEMPLATE_WISH_REFUSAL = 'reservation_wish_refused';
const TEMPLATE_WISH_CANCEL = 'reservation_wish_cancelled';
const TEMPLATE_RESERVATION_CONFIRMATION = 'reservation_confirmed';
const TEMPLATE_RESERVATION_CANCEL = 'reservation_cancelled';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

@Injectable()
export class EmailNotificationAdapter implements ReservationNotificationPort {
  private readonly logger = new Logger(EmailNotificationAdapter.name);

  constructor(private readonly mailClient: MailClient) {}

  async notifyReservationCreated(reservationId: UUID): Promise<void> {
    await this.sendReservationNotificationEmail(reservationId, TEMPLATE_RESERVATION_CONFIRMATION);
  }

  async notifyReservationCancelled(reservationId: UUID): Promise<void> {
    await this.sendReservationNotificationEmail(reservationId, TEMPLATE_RESERVATION_CANCEL);
  }

  async notifyWishCancel(reservationWishId: UUID): Promise<void> {
    await this.sendWishNotificationEmail(reservationWishId, TEMPLATE_WISH_CANCEL);
  }

  async notifyWishRefusal(reservationWishId: UUID): Promise<void> {
    await this.sendWishNotificationEmail(reservationWishId, TEMPLATE_WISH_REFUSAL);
  }

  private async sendWishNotificationEmail(
    reservationWishId: UUID,
    template: string,
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
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ${template} email: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }

  private async sendReservationNotificationEmail(
    reservationId: UUID,
    template: string,
  ): Promise<void> {
    this.logger.log(
      `sendNotificationEmail called for ${reservationId.uuid} with template ${template}`,
    );

    try {
      const { pack, user, startingDate } = await prisma.reservation.findUniqueOrThrow({
        where: { id: reservationId.uuid },
        include: {
          user: true,
          pack: true,
        },
      });

      if (!user) {
        this.logger.warn(
          `No user found for reservation ${reservationId.uuid}, skipping email notification.`,
        );
        return;
      }

      await this.mailClient.sendTemplate({
        to: user.email,
        template,
        variables: {
          nickname: user.firstName || '',
          startingDateLabel: formatDate(startingDate),
          selectedPackLabel: pack.label,
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
