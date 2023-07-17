import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const BIN_DIR: string = path.resolve(__dirname)
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
  execSync(`npx ts-node ${BIN_DIR}/cloc-package.ts ${botonicPackage}`, {
    stdio: 'inherit',
  })
})
