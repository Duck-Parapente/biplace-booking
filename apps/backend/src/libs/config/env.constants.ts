/**
 * Environment variable keys used throughout the application.
 * Centralizes all config keys to avoid typos and facilitate refactoring.
 */
export const envKeys = {
  env: 'ENV',
  apiKey: 'API_KEY',
  auth0Domain: 'AUTH0_DOMAIN',
  auth0Audience: 'AUTH0_AUDIENCE',
  mailgunApiKey: 'MAILGUN_API_KEY',
  mailDomain: 'MAIL_DOMAIN',
  mailSupportRecipient: 'MAIL_SUPPORT_RECIPIENT',
  mailTechRecipient: 'MAIL_TECH_RECIPIENT',
} as const;
