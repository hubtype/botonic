module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
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

    // compatibility with botonic style
    "no-null/no-null": "off",

    "prefer-const" : ["error", {"destructuring": "all"}],
//    "@typescript-eslint/no-use-before-define": ["error", { "variables": true, "functions": false, "classes": false }],
    "@typescript-eslint/no-use-before-define": "warn", //not an error due to our heavy use of const functions
    "@typescript-eslint/camelcase": "warn", // TODO add comments to allow backend ids but forbid elsewhere
    "@typescript-eslint/no-var-requires": "off", // TODO only enable for TS code
    "@typescript-eslint/no-empty-function": "warn",

    // for d.ts
    "@typescript-eslint/explicit-member-accessibility": "off",
  },
  env: {
    jest: true
  }
};
