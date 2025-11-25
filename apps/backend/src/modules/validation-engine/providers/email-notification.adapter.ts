import { envKeys } from '@libs/config/env.constants';
import { MailClient } from '@libs/mail/mail.client';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NotificationPort } from '../domain/notification.port';

@Injectable()
export class EmailNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(EmailNotificationAdapter.name);
  private readonly devTeamEmails: string[];

  constructor(
    private readonly mailClient: MailClient,
    private readonly configService: ConfigService,
  ) {
    this.devTeamEmails = [configService.getOrThrow<string>(envKeys.mailTechRecipient)];
  }

  async reportTechnicalError(error: Error, context?: Record<string, unknown>): Promise<void> {
    const env = this.configService.get<string>(envKeys.env) || 'unknown';
    const subject = `[${env.toUpperCase()}] Technical Error in Biplace Attribution`;

    const contextText = context
      ? Object.entries(context)
          .map(([key, value]) => `${key}: ${JSON.stringify(value, null, 2)}`)
          .join('\n')
      : 'No additional context';

    const text = `
        A technical error occurred during the pack attribution process.

        Environment: ${env}
        Error Name: ${error.name}
        Error Message: ${error.message}

        Stack Trace:
        ${error.stack || 'No stack trace available'}

        Context:
        ${contextText}

        Timestamp: ${new Date().toISOString()}
            `.trim();

    const html = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #e74c3c;">⚠️ Technical Error in Biplace Attribution</h2>
            <p><strong>Environment:</strong> ${env}</p>
            <p><strong>Error Name:</strong> ${error.name}</p>
            <p><strong>Error Message:</strong> ${error.message}</p>
            
            <h3>Stack Trace:</h3>
            <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${error.stack || 'No stack trace available'}</pre>
            
            <h3>Context:</h3>
            <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${contextText}</pre>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              <strong>Timestamp:</strong> ${new Date().toISOString()}
            </p>
          </body>
        </html>
    `.trim();

    try {
      await this.mailClient.sendEmail({
        to: this.devTeamEmails,
        subject,
        text,
        html,
      });
      this.logger.log(`Technical error report sent to dev team: ${error.message}`);
    } catch (emailError) {
      this.logger.error(
        `Failed to send technical error report: ${(emailError as Error).message}`,
        (emailError as Error).stack,
      );
    }
  }
}
