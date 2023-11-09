/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  setupFiles: [
    "./jest.setup.js"
  ],
  testRegex: "(/__test(s?)__/.*(test|spec))\\.[jt]s$",
  // This was pulling tests from dist so I'm ignoring it
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': 'ts-jest'

  },
};
