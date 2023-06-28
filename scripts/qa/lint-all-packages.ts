import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
const BIN_DIR = path.resolve(__dirname)

try {
  process.chdir(BIN_DIR)
} catch (error) {
  console.log(`Failed to change directory: ${error}`)
  process.exit(1)
}

const PACKAGES_DIR: string = path.resolve(`${BIN_DIR}/../../packages`)

const packageInPackages = fs.readdirSync(PACKAGES_DIR)
const botonicPackages = packageInPackages.filter(function (file: string) {
  return (
    file.startsWith('botonic') &&
    !file.includes('botonic-dx') &&
    !file.includes('botonic-eslint')
  )
})

botonicPackages.forEach(botonicPackage => {
  execSync(`npx ts-node lint-package.ts ../../packages/${botonicPackage}`, {
    stdio: 'inherit',
  })
})
