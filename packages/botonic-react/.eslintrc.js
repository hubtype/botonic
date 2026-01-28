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
  plugins: ['react-hooks'],
  rules: {
    // REACT
    'react/prop-types': ['error', { skipUndeclared: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-use-before-define': [
      'error', // we have many variables which are actually functions
      { variables: false, functions: false, classes: false },
    ],
    'react/no-unknown-property': ['warn'],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
}
