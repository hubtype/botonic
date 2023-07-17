import { execSync } from 'child_process'
import * as path from 'path'

const BIN_DIR: string = path.resolve(__dirname)
const ROOT_DIR: string = path.join(BIN_DIR, '../../')

const packagePath: string = path.resolve(
  `${ROOT_DIR}/packages/${process.argv[2]}`
)

console.log(`Lines at '${path.basename(process.argv[2])}'`)

const command = `${path.join(
  ROOT_DIR,
  'node_modules/.bin/cloc'
)} --match-f='js|js|ts|tsx' --not-match-f='\\.test\\.*' --not-match-d=node_modules ${path.join(
  packagePath,
  'src'
)} --json | grep SUM -A3 | grep code`

try {
  const output = execSync(command, { encoding: 'utf8' })
  console.log(output)
} catch (error) {
  console.error(error)
}
