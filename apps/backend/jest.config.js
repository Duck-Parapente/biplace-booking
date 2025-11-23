module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^shared$': '<rootDir>/../../packages/shared/src',
  },
};
