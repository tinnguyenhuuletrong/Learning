module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/tests"],
  testRegex: ["(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$"],
  testEnvironment: "node",
  verbose: true,
};
