module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "oclif",
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2017, // async is from ecma2017. Supported in node >=7.10
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "node/no-unsupported-features/es-syntax": "off", //babel will take care of ES compatibility
    "@typescript-eslint/explicit-member-accessibility": "off", //we think defaulting to public is a good default
    "@typescript-eslint/explicit-function-return-type": "off", // annoying for tests
    "dot-notation" : "off", // we want [] notation for externally defined interfaces (eg. contentful content types)
    // "quotes": ["warn", "single"], // it should be configurable through prettier
    "prettier/prettier": "warn",
    "@typescript-eslint/no-useless-constructor": "warn",
    "no-useless-constructor": "off", //makes no sense for TS (https://github.com/typescript-eslint/typescript-eslint/issues/426)
    "@typescript-eslint/no-parameter-properties": "off", // opinionated: parameter properties make data classes shorter
    "valid-jsdoc":  "off", // function comments hide code complexity (and typescript already have type specifications)
  },
  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  },
  env: {
    jest: true
  }
};
