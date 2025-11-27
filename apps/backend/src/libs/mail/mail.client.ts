import { envKeys } from '@libs/config/env.constants';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

interface BaseEmailOptions {
  to: string | string[];
}

export type SendEmailOptions = BaseEmailOptions & {
  text: string;
  subject: string;
  html?: string;
};

export type SendTemplateOptions = BaseEmailOptions & {
  template: string;
  variables?: Record<string, unknown>;
};

@Injectable()
export class MailClient {
  private readonly logger = new Logger(MailClient.name);
  private readonly mailgun: ReturnType<Mailgun['client']>;
  private readonly domain: string;
  private readonly replyTo: string;
  private readonly DEFAULT_HEADERS = {
    'h:X-Mailgun-Track': 'no',
    'h:X-Mailgun-Track-Clicks': 'no',
    'h:X-Mailgun-Track-Opens': 'no',
  } as const;

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.getOrThrow<string>(envKeys.mailgunApiKey);
    this.domain = configService.getOrThrow<string>(envKeys.mailDomain);
    this.replyTo = configService.getOrThrow<string>(envKeys.mailSupportRecipient);

    const mailgunClient = new Mailgun(formData);
    this.mailgun = mailgunClient.client({
      username: 'api',
      key: apiKey,
      url: 'https://api.eu.mailgun.net',
    });
  }

  private normalizeRecipients(to: string | string[]): string[] {
    return Array.isArray(to) ? to : [to];
  }

  private getBaseMessageData(to: string[]) {
    return {
      from: `Duck Biplace <support@${this.domain}>`,
      to,
      'h:Reply-To': `Support Biplace <${this.replyTo}>`,
      ...this.DEFAULT_HEADERS,
    };
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const recipients = this.normalizeRecipients(options.to);

      const messageData = {
        ...this.getBaseMessageData(recipients),
        text: options.text,
        subject: options.subject,
        ...(options.html && { html: options.html }),
      };

      const result = await this.mailgun.messages.create(this.domain, messageData);

      this.logger.log(`Email sent successfully to ${recipients.join(', ')}: ${result.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async sendTemplate(options: SendTemplateOptions): Promise<void> {
    try {
      const recipients = this.normalizeRecipients(options.to);

      const messageData = {
        ...this.getBaseMessageData(recipients),
        template: options.template,
        ...(options.variables && {
          'h:X-Mailgun-Variables': JSON.stringify(options.variables),
        }),
      };

      const result = await this.mailgun.messages.create(this.domain, messageData);

      this.logger.log(
        `Template email sent successfully to ${recipients.join(', ')}: ${result.id} (template: ${options.template})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send template email: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
