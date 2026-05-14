const baseConfig = require('../../jest.config.js');
const package = require('./package');

module.exports = {
  ...baseConfig,
  displayName: package.name,
  rootDir: '.',
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePathIgnorePatterns: [
    "<rootDir>/lib/"
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm|.bun|@react-native|react-native|@segment)/)',
  ],
  // TODO: get full coverage
  coverageThreshold: {
    global: {
      branches: 84,
      functions: 85,
      lines: 85,
      statements: 85,
    }
  },
};
