import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { chdir } from 'process'
import { prompt, Separator } from 'inquirer'
import * as spawn from 'await-spawn'
import { blue, green, red } from 'colors'

const readJSON = (jsonPath: string): any => {
  return JSON.parse(
    readFileSync(jsonPath, { encoding: 'utf-8' as BufferEncoding })
  )
}

const writeJSON = (jsonPath: string, object: any): void => {
  writeFileSync(jsonPath, JSON.stringify(object, null, 2) + '\n')
}

const fromEntries = (xs: [string | number | symbol, any][]) =>
  xs.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

const spawnProcess = async (
  command: string,
  args: string[] = [],
  log?: { onSuccess?: any }
) => {
  try {
    await spawn(command, args)
    log?.onSuccess()
  } catch (e) {
    console.error(`Failed on running commmand ${command} ${args.join(' ')}`)
  }
}

const clean = async () => {
  console.log(' - Cleaning...')
  await spawnProcess('rm', ['-rf', 'node_modules', 'dist', 'lib'], {
    onSuccess: () => console.log(green('   Project cleaned.\n')),
  })
}

const getPackageJSON = packagePath =>
  readJSON(join(packagePath, 'package.json'))

const getPkgVersion = packagePath =>
  readJSON(join(packagePath, 'package.json')).version

const bumpVersion = async (version, packagePath) => {
  console.log(' - Bumping version...')
  const logBumpedVersion = () => {
    console.log(green(`   Version bumped to ${getPkgVersion(packagePath)}.\n`))
  }
  if (version === 'final') {
    await spawnProcess('npm', ['version', 'minor'], {
      onSuccess: logBumpedVersion,
    })
  } else {
    await spawnProcess('npm', ['version', 'prerelease'], {
      onSuccess: logBumpedVersion,
    })
  }
  return getPkgVersion(packagePath)
}

const updateCliTemplates = (packagePath: string, bumpedVersion: any) => {
  const templatesDir = join(packagePath, 'templates')
  chdir(templatesDir)
  const templates = readdirSync(templatesDir).filter(
    file => !file.startsWith('.')
  )
  for (const template of templates) {
    const templatePath = join(templatesDir, template)
    changeBotonicDeps(templatePath, bumpedVersion)
  }
}

const changeBotonicDeps = (packagePath, withVersion) => {
  const packageJSON = getPackageJSON(packagePath)
  const newDependencies = fromEntries(
    Object.entries(packageJSON.dependencies).map(([k, v]) =>
      k.includes('@botonic') ? [k, withVersion] : [k, v]
    )
  )
  packageJSON.dependencies = newDependencies
  writeJSON(join(packagePath, 'package.json'), packageJSON)
}

const installDeps = async () => {
  console.log(' - Installing dependencies...')
  await spawnProcess('npm', ['install', '-D'], {
    onSuccess: () => console.log(green('   Installed successfully.\n')),
  })
}

const build = async () => {
  console.log(` - Building...`)
  await spawnProcess('npm', ['run', 'build'], {
    onSuccess: () => console.log(green('   Built successfully.\n')),
  })
}

process.chdir('..')
const packagesDir = join(process.cwd(), 'packages')
const packagesList = readdirSync(packagesDir).filter(p =>
  p.includes('botonic-')
)

packagesList.push(String(packagesList.shift())) // ['botonic-core', 'botonic-nlu', ..., 'botonic-cli']
;(async () => {
  const { version } = await prompt([
    {
      type: 'list',
      name: 'version',
      message: 'What version do you want to publish?',
      choices: ['alpha', 'rc', 'final'],
    },
  ])
  let confirmation = undefined
  const confirmationMessage = `You are going to release a new ${version} version. Proceed?`
  const res = await prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message:
        version === 'final' ? red(confirmationMessage) : confirmationMessage,
    },
  ])
  confirmation = res.confirmation
  if (!confirmation) return

  console.log(blue(`Publishing new Botonic version:`))

  for (const p of packagesList) {
    const packagePath = join(packagesDir, p)
    chdir(packagePath)
    console.log(`Preparing ${p}...`)
    console.log('====================================')
    // await clean()
    const bumpedVersion = await bumpVersion(version, packagePath)
    const botonicDepsVersion =
      version === 'final' ? `~${bumpedVersion}` : bumpedVersion

    if (p === 'botonic-cli') {
      updateCliTemplates(packagePath, botonicDepsVersion)
    } else changeBotonicDeps(packagePath, botonicDepsVersion)
    // await installDeps()
    // await build()
  }
})()
