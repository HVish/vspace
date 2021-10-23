/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('merge');
const tsJest = require('ts-jest/jest-preset');
const mongoDbJest = require('@shelf/jest-mongodb/jest-preset');

module.exports = merge.recursive(tsJest, mongoDbJest, {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
});
