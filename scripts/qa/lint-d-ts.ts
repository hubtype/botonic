import * as child_process from 'child_process'
import * as path from 'path'
const BIN_DIR: string = path.resolve(__dirname)
const PACKAGE_DIR = path.join(BIN_DIR, '../../', process.argv[2])

try {
  process.chdir(PACKAGE_DIR)
} catch (error) {
  console.error(`Failed to change directory: ${error}`)
  process.exit(1)
}

const TSC_DIR = path.join(BIN_DIR, '../../node_modules/.bin/tsc')

const LINT_D_PACKAGE = child_process.spawnSync(TSC_DIR, ['--noEmit'], {
  stdio: 'inherit',
})

if (LINT_D_PACKAGE.error) {
  console.error(
    `Failed to execute TypeScript type checking: ${LINT_D_PACKAGE.error}`
  )
  process.exit(1)
}

process.exit(LINT_D_PACKAGE.status ?? 0)
