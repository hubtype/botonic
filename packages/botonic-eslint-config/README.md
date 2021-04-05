# Botonic eslint config

Shareable eslint config as per the
[official documentation](https://eslint.org/docs/developer-guide/shareable-configs)

For a project to use this [eslint](https://eslint.org/) configuration, you'll need to:
* Add `extends: '@botonic/eslint-config/index.js',` to your .eslintrc.js
* If you can afford eslint to be slower (eg from your CI pipeline) to detect more issues, add '@botonic/eslint-config/index-ci.js'
* Add this script to your package.json: ` "lint": "eslint_d --fix --quiet 'src/**/*.js*' 'src/**/*.ts' "`.
* Execute `npm run lint`
  
Please check the [eslint user guide](https://eslint.org/docs/user-guide/) for adapting this configuration to your needs.
