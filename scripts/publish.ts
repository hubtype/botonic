import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { chdir } from 'process'
import { prompt } from 'inquirer'
import * as spawn from 'await-spawn'
import { blue, green, red } from 'colors'

const readJSON = (jsonPath: string): any =>
  JSON.parse(readFileSync(jsonPath, { encoding: 'utf-8' as BufferEncoding }))

const writeJSON = (jsonPath: string, object: any): void =>
  writeFileSync(jsonPath, JSON.stringify(object, null, 2) + '\n')

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
    console.log(
      red(`   Failed on running commmand ${command} ${args.join(' ')}\n`)
    )
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
    await spawnProcess('npm', ['version', 'prerelease', `--preid=${version}`], {
      onSuccess: logBumpedVersion,
    })
  }
  return getPkgVersion(packagePath)
}

const updateCliTemplates = async (packagePath: string, bumpedVersion: any) => {
  const templatesDir = join(packagePath, 'templates')
  chdir(templatesDir)
  const templates = readdirSync(templatesDir).filter(
    file => !file.startsWith('.')
  )
  for (const template of templates) {
    const templatePath = join(templatesDir, template)
    console.log(` Replacing deps for template: ${template}`)
    await changeBotonicDeps(templatePath, bumpedVersion)
  }
}

const changeBotonicDeps = async (packagePath, withVersion) => {
  console.log(' - Replacing botonic dependencies...')
  try {
    const packageJSON = getPackageJSON(packagePath)
    const newDependencies = fromEntries(
      Object.entries(packageJSON.dependencies).map(([k, v]) =>
        k.includes('@botonic') ? [k, withVersion] : [k, v]
      )
    )
    packageJSON.dependencies = newDependencies
    writeJSON(join(packagePath, 'package.json'), packageJSON)
    console.log(green('   Replaced botonic deps successfully.\n'))
  } catch (e) {
    console.log(red('   Failed at replacing botonic deps.'))
  }
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

const publish = async version => {
  console.log(` - Publishing ${version} version...`)
  if (version === 'rc' || version === 'alpha') {
    await spawnProcess(
      'npm',
      ['publish', '--access=public', '--tag', version],
      {
        onSuccess: () => console.log(green('   Published successfully.\n')),
      }
    )
  } else {
    if (version === 'final') return
    await spawnProcess('npm', ['publish', '--access=public'], {
      onSuccess: () => console.log(green('   Published successfully.\n')),
    })
  }
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

  console.log(blue(`Publishing new Botonic ${version} version:`))

  for (const p of packagesList) {
    const packagePath = join(packagesDir, p)
    chdir(packagePath)
    console.log(`Preparing ${p}...`)
    console.log('====================================')
    await clean()
    await installDeps()
    await build()
    const bumpedVersion = await bumpVersion(version, packagePath)
    const botonicDepsVersion =
      version === 'final' ? `~${bumpedVersion}` : bumpedVersion

    if (p === 'botonic-cli') {
      await updateCliTemplates(packagePath, botonicDepsVersion)
    } else await changeBotonicDeps(packagePath, botonicDepsVersion)
    await publish(version)
  }
})()
