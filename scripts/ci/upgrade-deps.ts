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

child_process.execSync(`renice 10 ${process.pid} > /dev/null`, {
  stdio: 'inherit',
})

child_process.execSync('eslint_d stop > /dev/null', { stdio: 'inherit' })

console.log('Upgrading common dev dependencies')
console.log('====================================')

child_process.execSync('npm i -D', { stdio: 'inherit' })

const packagesDir = path.join(BIN_DIR, '/../../packages')
const packageInPackages = fs.readdirSync(packagesDir)
const botonicPackages = packageInPackages.filter(function (file: string) {
  return file.startsWith('botonic')
})
process.chdir('packages')

botonicPackages.forEach(botonicPackage => {
  process.chdir(botonicPackage)
  console.log(`Upgrading ${botonicPackage} dependencies`)
  console.log('====================================')
  child_process.execSync(
    'BOTONIC_NO_INSTALL_ROOT_DEPENDENCIES=1 npm i -D > /dev/null',
    { stdio: 'inherit' }
  )
  process.chdir(packagesDir)
})

child_process.execSync('eslint_d start', { stdio: 'inherit' })
