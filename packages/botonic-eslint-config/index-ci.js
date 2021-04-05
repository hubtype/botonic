// Eslint configuration for CI (slower but detects more issues)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('./index.js')
base.parserOptions.project = './tsconfig.eslint.json'

base.rules['@typescript-eslint/no-floating-promises'] = 'error' // see https://github.com/xjamundx/eslint-plugin-promise/issues/151
base.rules['@typescript-eslint/no-misused-promises'] = 'error'
base.rules['@typescript-eslint/require-await'] = 'error'

// rules which are slower because they require type checking
//https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended-requiring-type-checking.json
base.extends.push(
  'plugin:@typescript-eslint/recommended-requiring-type-checking'
)
base.rules['@typescript-eslint/unbound-method'] = [
  'error',
  { ignoreStatic: true },
]
base.rules['@typescript-eslint/no-for-in-array'] = 'warn' // sometimes index is necessary
base.rules['@typescript-eslint/no-unnecessary-type-assertion'] = 'warn' //it has false positives

base.rules['@typescript-eslint/no-unsafe-member-access'] = 'warn'
base.rules['@typescript-eslint/no-unsafe-assignment'] = 'warn'
base.rules['@typescript-eslint/no-unsafe-return'] = 'warn'
base.rules['@typescript-eslint/no-unsafe-call'] = 'warn'

module.exports = base
