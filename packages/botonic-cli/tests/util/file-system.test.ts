import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import {
  copy,
  create,
  createTemp,
  pathExists,
  readDir,
  readJSON,
  remove,
  writeJSON,
} from '../../src/util/file-system'
import { execCommand } from '../../src/util/processes'

const existingPath = process.cwd()
const unexistingPath = 'unexistingPath'
const dirToTest = join(process.cwd(), 'botonic-tmp')

const withDirToTest = (
  toTest: () => any,
  { createDir } = { createDir: true }
): boolean => {
  let success = false
  try {
    createDir && create(dirToTest)
    toTest()
    success = true
  } catch (e) {
    success = false
  } finally {
    remove(dirToTest)
  }
  return success
}
const withTempDir = (toTest: (tempDir: string) => any) => {
  const tempDir = createTemp('botonic-tmp')
  toTest(tempDir)
  remove(tempDir)
}

const createFile = (path: string, content: string) => {
  writeFileSync(path, content, { encoding: 'utf-8' })
}

describe('TEST: File System utilities', () => {
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
    withDirToTest(() => {
      const sut = pathExists(dirToTest)
      expect(sut).toBe(true)
    })
  })
  it('Removes folders from unexisting path', () => {
    expect(
      withDirToTest(
        () => {
          const sut = () => remove(unexistingPath)
          expect(sut).toThrowError()
        },
        { createDir: false }
      )
    ).toBeFalsy()
  })
  it('Creates a directory in the given path', () => {
    withDirToTest(() => {
      const sut = pathExists(dirToTest)
      expect(sut).toBe(true)
    })
  })
  it('Creates a directory in the given path (already exists)', () => {
    withDirToTest(() => {
      const sut = () => create(dirToTest)
      expect(sut).toThrow()
    })
  })
  it('Creates a temporary directory', () => {
    withTempDir(tempDir => {
      const sut = pathExists(tempDir)
      expect(sut).toBe(true)
      expect.stringMatching(/botonic-tmp*/)
    })
  })
  it('Copy content', () => {
    const tmp1 = createTemp('botonic-tmp1')
    createFile(join(tmp1, 'dummy-file.txt'), 'dummy content')
    const tmp2 = createTemp('botonic-tmp2')
    copy(tmp1, tmp2)
    expect(readDir(tmp2)).toContain('dummy-file.txt')
    remove(tmp1)
    remove(tmp2)
  })
  it('Reads/Writes JSON correctly', () => {
    const tmpDir = createTemp('botonic-tmp')
    const path = join(tmpDir, 'dummy.json')
    writeJSON(path, {
      dummy: 'content',
    })
    const writtenContent = String(readFileSync(path))
    expect(writtenContent).toEqual('{"dummy":"content"}')
    const readContent = readJSON(path)
    expect(readContent).toEqual({ dummy: 'content' })
    execCommand(`touch ${tmpDir}/another.json`)
    const noContent = readJSON(join(tmpDir, 'another.json'))
    expect(noContent).toBeUndefined()
    remove(tmpDir)
  })
})
