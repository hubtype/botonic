module.exports = {
  extends: '@botonic/eslint-config/index.js',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      files: ['*.js'],
      rules: {
        'node/no-extraneous-require': 0,
      },
    },
  ],
}
