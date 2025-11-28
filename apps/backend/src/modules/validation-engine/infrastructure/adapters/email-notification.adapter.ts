import { envKeys } from '@libs/config/env.constants';
import { MailClient } from '@libs/mail/mail.client';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NotificationPort } from '../../domain/notification.port';

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
    const subject = `Biplace [${env}] - Attribution Error Report`;

    const contextText = context
      ? Object.entries(context)
          .map(([key, value]) => `${key}: ${JSON.stringify(value, null, 2)}`)
          .join('\n')
      : 'No additional context';

    const text = `
        Hello,

        A technical error occurred during the pack attribution process.

        Time: ${new Date().toISOString()}

        Error Details:
        - Name: ${error.name}
        - Message: ${error.message}

        Stack Trace:
        ${error.stack || 'No stack trace available'}

        Context:
        ${contextText}

        ---
        This is an automated notification from Biplace Attribution System.
        Please review and address this issue as soon as possible.
            `.trim();

    const html = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Attribution Error Report</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-left: 4px solid #e74c3c; padding: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 10px 0; color: #e74c3c; font-size: 18px;">⚠️ Attribution Error Report</h2>
            <p style="margin: 0; color: #666; font-size: 14px;">Environment: <strong>${env}</strong></p>
          </div>
          
          <p style="margin-bottom: 20px;">Hello,</p>
          
          <p style="margin-bottom: 20px;">A technical error occurred during the pack attribution process.</p>
          
          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #495057;">Error Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #666; width: 100px;">Time:</td>
                <td style="padding: 8px 0;">${new Date().toISOString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #666;">Type:</td>
                <td style="padding: 8px 0;">${error.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #666; vertical-align: top;">Message:</td>
                <td style="padding: 8px 0;">${error.message}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #495057;">Stack Trace</h3>
            <pre style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${error.stack || 'No stack trace available'}</pre>
          </div>
          
          ${
            context
              ? `<div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #495057;">Context</h3>
            <pre style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${contextText}</pre>
          </div>`
              : ''
          }
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from <strong>Biplace Attribution System</strong>.</p>
            <p style="margin: 5px 0 0 0;">Please review and address this issue as soon as possible.</p>
          </div>
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
