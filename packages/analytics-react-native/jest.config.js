const baseConfig = require('../../jest.config.js');
const package = require('./package');

module.exports = {
  ...baseConfig,
  displayName: package.name,
  rootDir: '.',
  preset: 'react-native',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  modulePathIgnorePatterns: [
    "<rootDir>/lib/"
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm|.bun|@react-native|react-native|@segment)/)',
  ],
  // TODO: get full coverage
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    }
  },
};
