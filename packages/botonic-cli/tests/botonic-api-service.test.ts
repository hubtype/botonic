import { Config } from '@oclif/config'
import { assert } from 'console'
// import { promises } from 'fs'
import { chdir } from 'process'

import { BotonicAPIService } from '../src/botonic-api-service'
import { EXAMPLES } from '../src/botonic-examples'
import { default as NewCommand } from '../src/commands/new'
import { copy, createTempDir, removeRecursively } from '../src/util/file-system'

describe('TEST: BotonicApiService', () => {
  const newCommand = new NewCommand(process.argv, new Config({ root: '' }))
  const BLANK_EXAMPLE = EXAMPLES[0]
  assert(BLANK_EXAMPLE.name === 'blank')

  it('Builds correctly a project', async () => {
    const tmpPath = createTempDir('botonic-tmp')
    console.log(BLANK_EXAMPLE)
    // await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
    copy(BLANK_EXAMPLE.localTestPath, tmpPath)
    chdir(tmpPath)
    await newCommand.installDependencies()
    const botonicApiService = new BotonicAPIService()
    const buildOut = await botonicApiService.build()
    expect(buildOut).toBe(true)
    chdir('..')
    removeRecursively(tmpPath)
  })
})
