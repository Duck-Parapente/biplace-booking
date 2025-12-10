import { prisma } from '@libs/database/prisma/prisma';
import { UUID } from '@libs/ddd/uuid.value-object';
import { MailClient } from '@libs/mail/mail.client';
import { ReservationNotificationPort } from '@modules/reservation/domain/ports/reservation-notification.port';
import { FlightLogProps } from '@modules/reservation/domain/reservation.types';
import { Injectable, Logger } from '@nestjs/common';

const TEMPLATE_WISH_REFUSAL = 'reservation_wish_refused';
const TEMPLATE_WISH_CANCEL = 'reservation_wish_cancelled';
const TEMPLATE_RESERVATION_CONFIRMATION = 'reservation_confirmed';
const TEMPLATE_RESERVATION_CANCEL = 'reservation_cancelled';
const TEMPLATE_RESERVATION_CLOSING = 'reservation_closed';

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

  async notifyReservationCreated(reservationId: UUID, initiatedBy?: UUID): Promise<void> {
    await this.sendReservationNotificationEmail(
      reservationId,
      initiatedBy,
      TEMPLATE_RESERVATION_CONFIRMATION,
    );
  }

  async notifyReservationCancelled(reservationId: UUID, initiatedBy?: UUID): Promise<void> {
    await this.sendReservationNotificationEmail(
      reservationId,
      initiatedBy,
      TEMPLATE_RESERVATION_CANCEL,
    );
  }

  async notifyReservationClosed(reservationId: UUID, flightLog: FlightLogProps): Promise<void> {
    try {
      const { pack, user, startingDate } = await prisma.reservation.findUniqueOrThrow({
        where: { id: reservationId.uuid },
        include: {
          user: true,
          pack: {
            select: {
              owner: true,
              label: true,
            },
          },
        },
      });

      if (!user) {
        this.logger.warn(
          `No user found for reservation ${reservationId.uuid}, skipping email notification.`,
        );
        return;
      }

      await this.mailClient.sendTemplate({
        to: [
          ...(user ? [user.email] : []),
          ...(flightLog.shouldWarnPackOwner ? [pack.owner.email] : []),
        ],
        template: TEMPLATE_RESERVATION_CLOSING,
        variables: {
          startingDateLabel: formatDate(startingDate),
          selectedPackLabel: pack.label,
          flightsCount: flightLog.flightsCount.value,
          flightTimeMinutes: flightLog.flightTimeMinutes.value,
          publicComment: flightLog.publicComment || '-',
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send reservation closed email: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }

  async notifyWishCancel(reservationWishId: UUID, explanationTable?: string): Promise<void> {
    await this.sendWishNotificationEmail(reservationWishId, TEMPLATE_WISH_CANCEL, explanationTable);
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

  private async sendReservationNotificationEmail(
    reservationId: UUID,
    initiatedBy: UUID | undefined,
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

      const initiator = initiatedBy
        ? await prisma.user.findUnique({
            where: { id: initiatedBy.uuid },
          })
        : null;

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
          initiatorName: initiator
            ? [initiator.firstName, initiator.lastName].filter(Boolean).join(' ')
            : 'Système',
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
