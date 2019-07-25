module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    "plugin:jest/recommended",
    // typescript
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  ],
  plugins: [
    "no-null",
    "filenames",
    "jest"
  ],
  parserOptions: {
    project: "./tsconfig.json",
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
    "filenames/match-regex": [2, "^[a-z-.]+$", true],


    // In typescript we must use obj.field when we have the types, and obj['field'] when we don't
    // Not set to warn because Webstorm cannot fix eslint rules with --quiet https://youtrack.jetbrains.com/issue/WEB-39246
    "dot-notation": "off",

    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "node/no-unsupported-features/es-syntax": "off", //babel will take care of ES compatibility
    "unicorn/no-abusive-eslint-disable" : "off",
    // allow public functions/classes to call private functions/classes declared below.
    // otoh, variables (typically constants) should be declared at the top
    "@typescript-eslint/no-use-before-define": ["error", { "variables": true, "functions": false, "classes": false }],

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
    "@typescript-eslint/no-non-null-assertion" : "warn", // specially useful in tests, and "when you know what you're doing"
    "@typescript-eslint/no-object-literal-type-assertion" : [ "error", {allowAsParameter: false}], //useful to pass options to plugins
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }], // to encapsulate types in namespace with same name as Class
  },
  env: {
    jest: true
  }
};
