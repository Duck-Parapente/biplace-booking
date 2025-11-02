import { registerAs } from '@nestjs/config';

export interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
}

export const Auth0ConfigType = 'auth0';

export const auth0Config = registerAs(
  Auth0ConfigType,
  (): Auth0Config => ({
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  }),
);
