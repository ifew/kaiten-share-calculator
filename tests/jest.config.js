/**
 * Jest Configuration for Kaiten Share Calculator
 */

module.exports = {
  // Root directory
  rootDir: '../',
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],
  
  // Test patterns to include
  testPathIgnorePatterns: [
    "/node_modules/",
    "/coverage/"
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  
  // Coverage settings 
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'app.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**'
  ],
  
  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Mock modules (fixed property name)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000
};