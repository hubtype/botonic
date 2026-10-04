import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const fixturesDir = fileURLToPath(new URL('./fixtures/', import.meta.url))

describe('node asset loader', () => {
  it('loads svg and png via native import', async () => {
    const svg = await import(pathToFileURL(`${fixturesDir}stub.svg`).href)
    expect(svg.default).toBe('test-file-stub')

    const png = await import(pathToFileURL(`${fixturesDir}stub.png`).href)
    expect(png.default).toBe('test-file-stub')
  })
})
