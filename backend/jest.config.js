module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@db$": "<rootDir>/db",
    "^@db/(.*)$": "<rootDir>/db/$1",
    "^@services/(.*)$": "<rootDir>/services/$1",
    "^@controllers/(.*)$": "<rootDir>/controllers/$1",
    "^@middleware/(.*)$": "<rootDir>/middleware/$1",
    "^@validation/(.*)$": "<rootDir>/validation/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@routes/(.*)$": "<rootDir>/routes/$1",
    // Mock uuid because v10+ is ESM-only and Jest runs in CommonJS mode.
    // We map it to a local CommonJS mock file to avoid "SyntaxError: Unexpected token 'export'".
    "^uuid$": "<rootDir>/tests/mocks/uuid.mock.ts",
  },
  collectCoverageFrom: [
    "services/**/*.ts",
    "controllers/**/*.ts",
    "routes/**/*.ts",
    "!**/*.test.ts",
    "!**/*.spec.ts",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/"],
};
