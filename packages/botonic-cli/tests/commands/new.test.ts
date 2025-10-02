// import { Config } from '@oclif/config'
// import { assert } from 'console'
// import { join } from 'path'
// import { chdir } from 'process'

// import { EXAMPLES } from '../../src/botonic-examples'
// import { default as NewCommand } from '../../src/commands/new'
// import {
//   copy,
//   createTempDir,
//   readDir,
//   readJSON,
//   removeRecursively,
// } from '../../src/util/file-system'

// const newCommand = new NewCommand(process.argv, new Config({ root: '' }))

// const BLANK_EXAMPLE = EXAMPLES[0]
// assert(BLANK_EXAMPLE.name === 'blank')

// describe('TEST: New command (resolving project)', () => {
//   it('Resolves correctly an existing one (argv)', async () => {
//     const botonicProjectName = 'blank'
//     const sut = await newCommand.resolveSelectedProject(botonicProjectName)
//     expect(sut).toEqual(BLANK_EXAMPLE)
//   })
//   it('Resolves correctly an unexisting one (argv)', async () => {
//     const sut = await newCommand.resolveSelectedProject('unexistingProject')
//     expect(sut).toBeUndefined()
//   })
// })

// describe('TEST: New command (downloading project)', () => {
//   it('Succeeds to download into path', async () => {
//     const tmpPath = createTempDir('botonic-tmp')
//     await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
//     const packageJSON = readJSON(join(tmpPath, 'package.json'))
//     expect((packageJSON as any).name).toEqual(tmpPath)
//     removeRecursively(tmpPath)
//   })
//   it('Fails to download into path', async () => {
//     const tmpPath = createTempDir('botonic-tmp')
//     await expect(
//       newCommand.downloadSelectedProjectIntoPath(
//         {
//           name: 'unexistingProject',
//           version: '0.0.0',
//           description: 'desc',
//           localTestPath: 'unexistingLocalPath',
//         },
//         tmpPath
//       )
//     ).rejects.toThrow(Error)
//     removeRecursively(tmpPath)
//   })
// })

// describe('TEST: New command (installing project)', () => {
//   it('Succeeds to install', async () => {
//     const tmpPath = createTempDir('botonic-tmp')
//     // await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
//     copy(BLANK_EXAMPLE.localTestPath, tmpPath)
//     chdir(tmpPath)
//     await newCommand.installDependencies()
//     const sut = readDir('.')
//     expect(sut).toContain('node_modules')
//     expect(sut).toContain('package-lock.json')
//     chdir('..')
//     removeRecursively(tmpPath)
//   })

//   it('Fails to install', async () => {
//     const tmpPath = createTempDir('botonic-tmp')
//     // await newCommand.downloadSelectedProjectIntoPath(BLANK_EXAMPLE, tmpPath)
//     copy(BLANK_EXAMPLE.localTestPath, tmpPath)
//     await expect(
//       newCommand.installDependencies('npm instal-typo')
//     ).rejects.toThrow(Error)
//     removeRecursively(tmpPath)
//   })
// })
