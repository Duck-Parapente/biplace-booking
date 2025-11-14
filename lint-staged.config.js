/* eslint-disable */
module.exports = {
  'apps/**/*.{js,jsx,ts,tsx,vue}': ['eslint --cache --fix', 'prettier --write'],
  'apps/backend/**/*.ts': () => 'cd apps/backend && pnpm lint:deps',
};
