module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    "no-null"
  ],
  parserOptions: {
    ecmaVersion: 2017, // async is from ecma2017. Supported in node >=7.10
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
// npm run lint runs eslint with --quiet --fix so that only errors are fixed
  rules: {
    // style. Soon a precommit githook will fix prettier errors
    "prettier/prettier": "error",

    "dot-notation": "warn", // in typescript we must use obj.field when we have the types, and obj['field'] when we don't
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "node/no-unsupported-features/es-syntax": "off", //babel will take care of ES compatibility
    "unicorn/no-abusive-eslint-disable" : "off",

    // special for TYPESCRIPT
    "no-null/no-null": "warn", // fields declared with ? are undefined, not null (be aware that React uses null)
    "@typescript-eslint/explicit-member-accessibility": "off", //we think defaulting to public is a good default
    "@typescript-eslint/explicit-function-return-type": "off", // annoying for tests
    "@typescript-eslint/no-useless-constructor": "warn",
    "no-useless-constructor": "off", //makes no sense for TS (https://github.com/typescript-eslint/typescript-eslint/issues/426)
    "@typescript-eslint/no-parameter-properties": "off", // opinionated: parameter properties make data classes shorter
    "valid-jsdoc": "off", // function comments hide code complexity (and typescript already have type specifications),
    "unicorn/prevent-abbreviations" : "off", // the plugin removes removes type annotations from typescript code :-(
    "unicorn/filename-case" : "off", // React convention is in CamelCase
    "@typescript-eslint/no-non-null-assertion" : "warn" // specially useful in tests, and "when you know what you're doing"
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
