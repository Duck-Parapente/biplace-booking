import { envKeys } from '@libs/config/env.constants';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class MailClient {
  private readonly logger = new Logger(MailClient.name);
  private readonly mailgun: ReturnType<Mailgun['client']>;
  private readonly domain: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.getOrThrow<string>(envKeys.mailgunApiKey);
    this.domain = configService.getOrThrow<string>(envKeys.mailDomain);
    this.fromEmail = configService.getOrThrow<string>(envKeys.mailSupportRecipient);

    const mailgunClient = new Mailgun(formData);
    this.mailgun = mailgunClient.client({
      username: 'api',
      key: apiKey,
      url: 'https://api.eu.mailgun.net',
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const recipients = Array.isArray(options.to) ? options.to : [options.to];

      const messageData = {
        from: this.fromEmail,
        to: recipients,
        subject: options.subject,
        text: options.text,
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
}
