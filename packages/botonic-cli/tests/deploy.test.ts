import { Config } from '@oclif/config'
import { assert } from 'console'
import { mkdtempSync, readdirSync } from 'fs'
import { removeSync } from 'fs-extra'
import { join } from 'path'
import { chdir, cwd } from 'process'
import rimraf from 'rimraf'

import { BotonicAPIService } from '../src/botonic-api-service'
import { EXAMPLES } from '../src/botonic-examples'
import { default as DeployCommand } from '../src/commands/deploy'
import { default as NewCommand } from '../src/commands/new'

const botonicApiService = new BotonicAPIService()
const newCommand = new NewCommand(process.argv, new Config({ root: '' }))
const deployCommand = new DeployCommand(process.argv, new Config({ root: '' }))

const BLANK_EXAMPLE = EXAMPLES[3]
assert(BLANK_EXAMPLE.name === 'blank')

describe('TEST: Deploy pipeline', () => {
  test('Deploy', async () => {
    const tmpPath = mkdtempSync('botonic-tmp')
    await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
    chdir(tmpPath)
    await newCommand.installDependencies()

    const spyDeployBundle = jest
      .spyOn(deployCommand, 'deployBundle')
      .mockImplementation(async () => {
        return { hasDeployErrors: false }
      })

    const spyDeploy = jest
      .spyOn(deployCommand, 'deploy')
      .mockImplementation(async () => {
        await botonicApiService.build()
        await deployCommand.createBundle()
        const onceBundled = readdirSync('.')
        expect(onceBundled).toContain('botonic_bundle.zip')
        expect(onceBundled).toContain('tmp')
        const { hasDeployErrors } = await deployCommand.deployBundle()
        expect(hasDeployErrors).toBe(false)
        removeSync(join('.', 'botonic_bundle.zip'))
        removeSync(join('.', 'tmp'))
      })

    await deployCommand.deploy()
    const onceDeployed = readdirSync('.')
    expect(onceDeployed).not.toContain('botonic_bundle.zip')
    expect(onceDeployed).not.toContain('tmp')
    chdir('..')

    rimraf.sync(tmpPath)
    spyDeployBundle.mockRestore()
    spyDeploy.mockRestore()
  })
})
