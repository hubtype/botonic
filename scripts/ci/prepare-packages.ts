import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
const BIN_DIR = path.resolve(__dirname)

try {
  process.chdir(path.join(BIN_DIR, '/../..'))
} catch (error) {
  console.log(`Failed to change directory: ${error}`)
  process.exit(1)
}

try {
  process.chdir('packages')
} catch (error) {
  console.log(`Failed to change directory: ${error}`)
  process.exit(1)
}

const PACKAGES_DIR: string = path.resolve(`${BIN_DIR}/../../packages`)

const packageInPackages = fs.readdirSync(PACKAGES_DIR)
const botonicPackages = packageInPackages.filter(function (file: string) {
  return file.startsWith('botonic')
})

botonicPackages.forEach(pkg => {
  try {
    process.chdir(pkg)
  } catch (error) {
    process.exit()
  }
  console.log(`Preparing ${pkg}...`)
  console.log('====================================')
  console.log('Cleaning...')
  child_process.execSync('nice rm rf node_modules lib dist')
  console.log('Installing deps...')
  child_process.execSync('nice npm i -D > /dev/null')
  console.log('Building...')
  child_process.execSync('nice npm run build > /dev/null')
  console.log('')
  process.chdir('..')
})

child_process.execSync('killall eslint_d 2> /dev/null')
child_process.execSync('killall -9 eslint_d 2> /dev/null')
