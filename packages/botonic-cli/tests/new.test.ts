import { Config } from '@oclif/config'
import { assert } from 'console'
import { mkdtempSync, readdirSync } from 'fs'
import { join } from 'path'
import rimraf from 'rimraf'

import { EXAMPLES } from '../src/botonic-examples'
import { default as NewCommand } from '../src/commands/new'
import { readJSON } from '../src/utils'

const newCommand = new NewCommand(process.argv, new Config({ root: '' }))

const BLANK_EXAMPLE = EXAMPLES[3]
assert(BLANK_EXAMPLE.name === 'blank')

describe('TEST: New command (resolving project)', () => {
  it('Resolves correctly an existing one (argv)', async () => {
    const botonicProjectName = 'blank'
    const sut = await newCommand.resolveSelectedProject(botonicProjectName)
    expect(sut).toEqual(BLANK_EXAMPLE)
  })
  it('Resolves correctly an unexisting one (argv)', async () => {
    const sut = await newCommand.resolveSelectedProject('unexistingProject')
    expect(sut).toEqual(undefined)
  })
})

describe('TEST: New command (downloading project)', () => {
  it('Succeeds to download into path', async () => {
    const tmpPath = mkdtempSync('botonic-tmp')
    await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
    const packageJSON = readJSON(join(tmpPath, 'package.json'))
    expect((packageJSON as any).name).toEqual('blank')
    rimraf.sync(tmpPath)
  })
  it('Fails to download into path', async () => {
    const tmpPath = mkdtempSync('botonic-tmp')
    await expect(
      newCommand.downloadSelectedProjectIntoPath(
        {
          name: 'unexistingProject',
          uri: 'https://not-existing.com',
          description: 'desc',
        },
        tmpPath
      )
    ).rejects.toThrow(Error)
    rimraf.sync(tmpPath)
  })
})

describe('TEST: New command (installing project)', () => {
  it('Succeeds to install', async () => {
    const tmpPath = mkdtempSync('botonic-tmp')
    await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
    await newCommand.installProjectDependencies(tmpPath)
    const sut = readdirSync('.')
    expect(sut).toContain('node_modules')
    expect(sut).toContain('package-lock.json')
    process.chdir('..')
    rimraf.sync(tmpPath)
  })

  it('Fails to install', async () => {
    const tmpPath = mkdtempSync('botonic-tmp')
    await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
    await expect(
      newCommand.installProjectDependencies(tmpPath, 'npm instal-typo')
    ).rejects.toThrow(Error)
    rimraf.sync(tmpPath)
  })
})
