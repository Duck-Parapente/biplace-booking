import type { Config } from 'tailwindcss';

type Env = 'local' | 'staging' | 'prod';
const env = (process.env.NUXT_PUBLIC_ENV as Env) || 'prod';
const colors: Record<Env, string> = {
  local: '#ADDF20',
  staging: '#E09846',
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
          100: '#F7F9E8',
          400: colors[env] ?? colors.prod,
          800: '#6B7A1A',
        },
        secondary: {
          100: '#E8F0F0',
          600: '#376465',
          700: '#2C4B4D',
          800: '#1F3637',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
