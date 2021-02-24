import { Config } from '@oclif/config'

import { EXAMPLES } from '../src/botonic-examples'
import { default as NewCommand } from '../src/commands/new'

const newCommand = new NewCommand(process.argv, new Config({ root: '' }))

describe('TEST: New command', () => {
  it('Resolves correctly an existing project (argv)', async () => {
    const botonicProjectName = 'blank'
    const sut = await newCommand.resolveSelectedProject(botonicProjectName)
    const expected = EXAMPLES.find(e => e.name === botonicProjectName)
    expect(sut).toEqual(expected)
  })
  it('Resolves correctly an unexisting project (argv)', async () => {
    const sut = await newCommand.resolveSelectedProject('unexistingProject')
    expect(sut).toEqual(undefined)
  })

  // await this.downloadSelectedProjectIntoPath(
  //   selectedProjectName,
  //   userProjectDirName
  // )

  // await this.installProjectDependencies(userProjectDirName)
})
