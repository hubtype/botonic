module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:node/recommended',
    'plugin:import/recommended',
    // typescript
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  ],
  plugins: ['jest', 'no-null', 'filenames', '@typescript-eslint', 'import'],
  parserOptions: {
    ecmaVersion: 2017, // async is from ecma2017. Supported in node >=7.10
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  // npm run lint runs eslint with --quiet --fix so that only errors are fixed
  rules: {
    // style. Soon a precommit githook will fix prettier errors
    'prettier/prettier': 'error',
    'filenames/match-regex': ['error', '^[a-z-.]+$', true],

    complexity: ['error', { max: 18 }],

    // In typescript we must use obj.field when we have the types, and obj['field'] when we don't
    // Not set to warn because Webstorm cannot fix eslint rules with --quiet https://youtrack.jetbrains.com/issue/WEB-39246
    'dot-notation': 'off',
    'no-console': 'off',
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'node/no-unsupported-features/es-syntax': 'off', //babel will take care of ES compatibility
    'unicorn/no-abusive-eslint-disable': 'off',
    "@typescript-eslint/naming-convention": "warn",
    'consistent-return': 'error',
    'jest/no-export': 'warn',
    'no-empty': 'warn',
    'prefer-const': ['error', { destructuring: 'all' }],

    // import rules
    'node/no-missing-import': [
      'error',
      {
        tryExtensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    ],
    'import/no-unresolved': 'error',
    'import/default': 'warn', // syntax "export = xxxx" is not supported
    'node/no-extraneous-import': 'warn', // otherwise it does not find ts-mockito if only defined in parent project

    // special for TYPESCRIPT
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off', // annoying for tests
    '@typescript-eslint/explicit-member-accessibility': 'off', //we think defaulting to public is a good default
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }], // to encapsulate types in namespace with same name as Class
    '@typescript-eslint/no-non-null-assertion': 'warn', // specially useful in tests, and "when you know what you're doing"
    '@typescript-eslint/no-parameter-properties': 'off', // opinionated: parameter properties make data classes shorter
    // allow public functions/classes to call private functions/classes declared below.
    // otoh, variables (typically constants) should be declared at the top
    '@typescript-eslint/no-use-before-define': [
      'error',
      { variables: true, functions: false, classes: false },
    ],
    '@typescript-eslint/no-useless-constructor': 'warn',
    'no-empty-pattern': 'off',
    // 'no-null/no-null': 'warn', // fields declared with ? are undefined, not null (be aware that React uses null)
    'unicorn/prevent-abbreviations': 'off', // the plugin removes removes type annotations from typescript code :-(
    'unicorn/filename-case': 'off', // React convention is in CamelCase
    'valid-jsdoc': 'off', // function comments hide code complexity (and typescript already have type specifications),
  },
  overrides: [
    {
      files: [
        '**/*.js', // to be able to skip required fields when not used in a particular test
        '**/*.jsx'
      ],
      rules: {
        // pending to mark unused vars with _...
        //'no-unused-vars': ['error', { 'varsIgnorePattern': '^_' }],
      }
    },
    {
      files: [
        '**/*.ts', // to be able to skip required fields when not used in a particular test
      ],
      rules: {
        "import/namespace": "off",
        // pending to mark unused vars with _...
        //'@typescript-eslint/no-unused-vars': ['error', { 'varsIgnorePattern': '^_' }],
      }
    },
  ],
  env: {
    jest: true,
    'jest/globals': true,
    es6: true,
    // browser/node to prevent "'console' is not defined  no-undef"
    browser: true,
    node: true,
  },
}
if (typeof AVOID_IMPORT_CRASH !== 'undefined' && AVOID_IMPORT_CRASH) {
  // avoid eslint-plugin-import crash https://github.com/benmosher/eslint-plugin-import/issues/1818#issuecomment-651547125
  delete module.exports['settings']['import/parsers']
}

