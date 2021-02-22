import { join } from 'path'
import { chdir, cwd } from 'process'

import { BotonicAPIService } from '../src/botonic-api-service'

const workingDirectory = cwd()
const pathToBotonicProject = join(workingDirectory, 'tests', 'dummy-project')
const botonicApiService = new BotonicAPIService()

describe('TEST: BotonicApiService', () => {
  it('Builds correctly a project', async () => {
    chdir(pathToBotonicProject)
    const buildOut = await botonicApiService.build()
    expect(buildOut).toBe(true)
    chdir(workingDirectory)
  })
})
