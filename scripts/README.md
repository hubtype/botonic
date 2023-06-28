# Scripts

Scripts for:

- Quality Assurance (QA)
- Continuous Integration (CI)
- Natural Language Understanding (NLU).

## Bash scripts

#### CI

- bump-version.sh:
  - Use: This script has to be launched manually.
  - Functionality: Bumps versions of Botonic packages to the inputed version. It affects the templates in `botonic-cli` and `botonic-react` and `botonic-plugin-nlu` , because updates the dependencies for packages pointing to other botonic projects.
- prepare-packages.sh:
  - Use: This script has to be launched manually.
  - Functionality: This script cleans the package `node_modules`, `lib` and `dist`. Then it reinstalls it, and also runs the build command. Finally, restarts the `eslint_d` plugin
- upgrade-deps.sh:
  - Use: This script has to be launched manually.
  - Functionality: This script stops eslint plugin, upgrades all the development dependencies for every package and finally restart the eslint plugin.

#### QA

- lint-d-ts.sh:
  - Use: This script is used by two pre-commit hooks: botonic-core and botonic-react.
  - Functionality: This script runs a linter on the .d.ts files of the selected package, without creating new files due to the `--noEmit`
- lint-package.sh:
  - Use: This script is launched when changes are detected on any package in packages.
  - Functionality: This scripts runs the npm run lint command. If the script detects that changes have been made, the script asks the user to perform two different git commands to check the changed files.
- lint-all-packages.sh:
  - Use: This script has to be launched manually.
  - Functionality: Runs for each package in packages, the lint-package.sh script.
- cloc-package.sh:
  - Use: Used only by clock-all-packages.sh.
  - Functionality: Counts all the lines of code (ignoring blankspaces and comments) of the package.
- cloc-all-packages.sh:
  - Use: This script has to be launched manually.
  - Functionality: Counts all the lines of code of each package in the packages folder.
