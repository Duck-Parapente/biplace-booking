import type { Config } from 'tailwindcss';

type Env = 'local' | 'staging' | 'prod';
const env = (process.env.NUXT_PUBLIC_ENV as Env) || 'prod';
const colors: Record<Env, string> = {
  local: '#ADDF20',
  staging: '#DA8525',
  prod: '#E2C736',
};

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: colors[env] ?? colors.prod,
        },
        secondary: {
          600: '#376465',
          700: '#2C4B4D',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
