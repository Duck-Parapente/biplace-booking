import { MailClient } from '@libs/mail/mail.client';
import { Injectable, Logger } from '@nestjs/common';

import { ReservationWishNotificationPort } from '../domain/ports/reservation-wish-notification.port';
import { ReservationWishNotificationProps } from '../domain/reservation.types';

const TEMPLATE_CONFIRMATION = {
  name: 'reservation_wish_confirmed',
  variables: ['nickname', 'selectedPackLabel', 'startingDateLabel'],
};
const TEMPLATE_REFUSAL = {
  name: 'reservation_wish_refused',
  variables: ['nickname', 'startingDateLabel'],
};

@Injectable()
export class EmailNotificationAdapter implements ReservationWishNotificationPort {
  private readonly logger = new Logger(EmailNotificationAdapter.name);

  constructor(private readonly mailClient: MailClient) {}

  async notifyConfirmation(payload: ReservationWishNotificationProps): Promise<void> {
    await this.sendNotificationEmail(
      payload,
      TEMPLATE_CONFIRMATION.name,
      {
        nickname: payload.user.firstName ?? '',
        selectedPackLabel: payload.selectedPackLabel,
        startingDateLabel: this.formatDate(payload.startingDate.value),
      },
      'confirmation',
    );
  }

  async notifyRefusal(payload: ReservationWishNotificationProps): Promise<void> {
    await this.sendNotificationEmail(
      payload,
      TEMPLATE_REFUSAL.name,
      {
        nickname: payload.user.firstName ?? '',
        startingDateLabel: this.formatDate(payload.startingDate.value),
      },
      'refusal',
    );
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private async sendNotificationEmail(
    payload: ReservationWishNotificationProps,
    template: string,
    variables: Record<string, string>,
    emailType: string,
  ): Promise<void> {
    try {
      await this.mailClient.sendTemplate({
        to: payload.user.email.email,
        template,
        variables,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ${emailType} email: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
