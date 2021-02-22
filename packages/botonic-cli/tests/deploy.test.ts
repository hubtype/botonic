import { Config } from '@oclif/config'
import { readdirSync } from 'fs'
import { join } from 'path'
import { chdir, cwd } from 'process'
import rimraf from 'rimraf'
import { removeSync } from 'fs-extra'

import { default as DeployCommand } from '../src/commands/deploy'
import { BotonicAPIService } from '../src/botonic-api-service'

const workingDirectory = cwd()
const pathToBotonicProject = join(workingDirectory, 'tests', 'dummy-project')
const deployCommand = new DeployCommand(process.argv, new Config({ root: '' }))
const botonicApiService = new BotonicAPIService()
describe('TEST: Deploy pipeline', () => {
  test('Deploy', async () => {
    chdir(pathToBotonicProject)
    await deployCommand.createBundle()

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
        const onceBundled = readdirSync(pathToBotonicProject)
        expect(onceBundled).toContain('botonic_bundle.zip')
        expect(onceBundled).toContain('tmp')
        const { hasDeployErrors } = await deployCommand.deployBundle()
        expect(hasDeployErrors).toBe(false)
        removeSync(join(pathToBotonicProject, 'botonic_bundle.zip'))
        removeSync(join(pathToBotonicProject, 'tmp'))
      })

    await deployCommand.deploy()
    const onceDeployed = readdirSync(pathToBotonicProject)
    expect(onceDeployed).not.toContain('botonic_bundle.zip')
    expect(onceDeployed).not.toContain('tmp')
    chdir(workingDirectory)

    spyDeployBundle.mockRestore()
    spyDeploy.mockRestore()
  })
})
