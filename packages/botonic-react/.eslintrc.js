module.exports = {
  extends: [
    '../.eslintrc.js',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // REACT
    'react/prop-types': ['error', { skipUndeclared: true }],
    '@typescript-eslint/no-use-before-define': [
      'error', // we have many variables which are actually functions
      { variables: false, functions: false, classes: false },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}
