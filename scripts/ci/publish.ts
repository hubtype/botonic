import { join } from 'path'
import { chdir } from 'process'
import { blue } from 'colors'
import {
  build,
  bumpVersion,
  changeBotonicDeps,
  clean,
  doAskForConfirmation,
  doAskVersionToPublish,
  installDeps,
  publish,
  CONSTANTS as C,
  Versions,
  sortPackagesByPreference,
} from './utils'

process.chdir('..')
const packagesDir = join(process.cwd(), C.PACKAGES_DIRNAME)
const packagesList = sortPackagesByPreference(packagesDir)

;(async () => {
  let version = ''
  if (process.argv[2]) {
    version = process.argv[2]
  } else {
    version = await doAskVersionToPublish()
    const confirmation = await doAskForConfirmation(version)
    if (!confirmation) return
  }

  console.log(blue(`Publishing new Botonic ${version} version:`))

  for (const pkg of packagesList) {
    const packagePath = join(packagesDir, pkg)
    chdir(packagePath)
    console.log(`Preparing ${pkg}...`)
    console.log('====================================')
    await clean()
    await installDeps()
    await build()
    const bumpedVersion = await bumpVersion(version, packagePath)
    const botonicDepsVersion =
      version === Versions.FINAL ? `~${bumpedVersion}` : bumpedVersion
    await changeBotonicDeps(packagePath, botonicDepsVersion)
    await publish(version)
  }
})()
