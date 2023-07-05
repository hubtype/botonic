import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

function update_botonic_deps(
  packageDir: string,
  version: string,
  phase: string
) {
  console.log(` - Updating botonic deps for ${packageDir}`)
  const regex = new RegExp(`("@botonic\/(.*)": )"(.*)"`, 'g')
  const rc = phase.includes('rc') ? `/$1"${version}` : `/$1~"${version}`
  child_process.execSync(`sed -i.aux -E ${regex}${rc} package.json`)
  child_process.execSync('rm package.json.aux')
}

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

const version = process.argv[3]
const phase = process.argv[4]
if (!!phase) {
  const PACKAGES_DIR: string = path.resolve(`${BIN_DIR}/../../packages`)

  const packageInPackages = fs.readdirSync(PACKAGES_DIR)
  const botonicPackages = packageInPackages.filter(function (file: string) {
    return file.startsWith('botonic')
  })
  console.log(process.cwd())

  botonicPackages.forEach(pkg => {
    try {
      process.chdir(pkg)
    } catch (error) {
      process.exit()
    }
    console.log(`Bumping ${pkg} to ${version}`)
    console.log('====================================')

    if (pkg.includes('botonic-cli')) {
      try {
        process.chdir('templates')
      } catch (error) {
        process.exit()
      }
      for (const template of fs.readdirSync('.')) {
        process.chdir(template)
        update_botonic_deps(template, version, phase)
        process.chdir('..')
      }
      process.chdir('..')
    }
    if (pkg.includes('botonic-react') || pkg.includes('botonic-plugin-nlu')) {
      update_botonic_deps(pkg, version, phase)
    }

    child_process.execSync(`nice npm version ${version} > /dev/null`)
    process.chdir('..')
  })
} else {
  process.exit(0)
}
