/* eslint-disable */
module.exports = {
  'apps/**/*.{js,jsx,ts,tsx,vue}': ['eslint --cache --fix', 'prettier --write'],
  'apps/backend/**/*.ts': ['pnpm --filter=backend lint:deps'],
};
