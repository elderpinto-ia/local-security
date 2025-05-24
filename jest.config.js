module.exports = {
  preset: 'ts-jest', // Using the preset
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src', // Standard NestJS: rootDir is 'src'
  testRegex: '.*\\.spec\\.ts$', // Test regex for files within rootDir
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // Transform should be handled by preset but can be explicit
  },
  collectCoverageFrom: ['**/*.(t|j)s'], // Paths are relative to rootDir (src)
  coverageDirectory: '../coverage', // Path is relative to rootDir (src)
};
