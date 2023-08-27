module.exports = {
  preset: "ts-jest",
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  testEnvironment: "node",
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/__tests__/__mocks__/mocks.ts",
  ],
};
