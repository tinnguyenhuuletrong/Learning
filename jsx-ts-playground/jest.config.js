module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/tests'],
  testRegex: ['(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$'],
  name: 'ts-template',
  displayName: 'ts-template',
  testEnvironment: 'node',
  verbose: true,
}
