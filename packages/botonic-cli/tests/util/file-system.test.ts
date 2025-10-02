import {readFileSync, writeFileSync} from 'fs'
import {join} from 'path'

import {
  copy,
  createDir,
  createTempDir,
  pathExists,
  readDir,
  readJSON,
  removeRecursively,
  writeJSON,
} from '../../src/util/file-system'
import {execCommandSafe} from '../../src/util/system'

const createFile = (path: string, content: string) => {
  writeFileSync(path, content, {encoding: 'utf-8'})
}

describe('TEST: File System utilities', () => {
  const existingPath = process.cwd()
  const unexistingPath = 'unexistingPath'

  let tempDir
  beforeEach(() => {
    tempDir = createTempDir('botonic-tmp')
  })

  afterEach(() => {
    removeRecursively(tempDir)
  })
  it('Checks an existing path', () => {
    const sut = pathExists(existingPath)
    expect(sut).toBeTruthy()
  })
  it('Check an unexisting path', () => {
    const sut = pathExists(unexistingPath)
    expect(sut).toBeFalsy()
  })
  it('Reads content from path', () => {
    const sut = Array.isArray(readDir(existingPath))
    expect(sut).toBe(true)
  })
  it('Reads content from unexisting path', () => {
    const sut = () => readDir(unexistingPath)
    expect(sut).toThrow()
  })
  it('Removes folders from existing path', () => {
    const sut = pathExists(tempDir)
    expect(sut).toBe(true)
  })
  it('Removes folders from unexisting path', () => {
    const sut = () => removeRecursively(unexistingPath)
    expect(sut()).toBeFalsy()
  })
  it('Creates a directory in the given path', () => {
    const sut = pathExists(tempDir)
    expect(sut).toBe(true)
  })
  it('Creates a directory in the given path (already exists)', () => {
    const sut = () => createDir(tempDir)
    expect(sut).toThrow()
  })

  it('Copy content', () => {
    const tmp1 = createTempDir('botonic-tmp1')
    createFile(join(tmp1, 'dummy-file.txt'), 'dummy content')
    const tmp2 = createTempDir('botonic-tmp2')
    copy(tmp1, tmp2)
    expect(readDir(tmp2)).toContain('dummy-file.txt')
    removeRecursively(tmp1)
    removeRecursively(tmp2)
  })
  it('Creates a temporary directory', () => {
    const sut = pathExists(tempDir)
    expect(sut).toBe(true)
    expect.stringMatching(/botonic-tmp*/)
  })

  it('Reads/Writes JSON correctly', () => {
    const path = join(tempDir, 'dummy.json')
    writeJSON(path, {
      dummy: 'content',
    })
    const writtenContent = String(readFileSync(path))
    expect(writtenContent).toEqual('{"dummy":"content"}')
    const readContent = readJSON(path)
    expect(readContent).toEqual({dummy: 'content'})
    execCommandSafe(`touch ${tempDir}/another.json`)
    const noContent = readJSON(join(tempDir, 'another.json'))
    expect(noContent).toBeUndefined()
  })
})
