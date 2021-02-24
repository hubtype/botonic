import { Config } from '@oclif/config'
import { assert } from 'console'
import { mkdtempSync } from 'fs'
import { chdir } from 'process'
import rimraf from 'rimraf'

import { BotonicAPIService } from '../src/botonic-api-service'
import { EXAMPLES } from '../src/botonic-examples'
import { default as NewCommand } from '../src/commands/new'

describe('TEST: BotonicApiService', () => {
  const newCommand = new NewCommand(process.argv, new Config({ root: '' }))
  const BLANK_EXAMPLE = EXAMPLES[3]
  assert(BLANK_EXAMPLE.name === 'blank')

  it('Builds correctly a project', async () => {
    const tmpPath = mkdtempSync('botonic-tmp')
    await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
    chdir(tmpPath)
    await newCommand.installDependencies()
    const botonicApiService = new BotonicAPIService()
    const buildOut = await botonicApiService.build()
    expect(buildOut).toBe(true)
    chdir('..')
    rimraf.sync(tmpPath)
  })
})
