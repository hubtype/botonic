module.exports = {
  roots: ["<rootDir>"],
  // if transform configured, it will not read babel.config.js
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest"
  // },
  verbose: true,
  testRegex: "(tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
