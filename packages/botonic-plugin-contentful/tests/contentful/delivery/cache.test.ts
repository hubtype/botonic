import { CachedClientApi } from '../../../src/contentful/delivery/cache'
import { MockClientApi } from './mock-client.helper'

test('TEST: CachedClientApi getAsset is cached', async () => {
  const id = Math.random().toString()
  await testHitAndMiss(
    sut => sut.getAsset(id),
    sut => sut.asset
  )
})

test('TEST: CachedClientApi getAssets is cached', async () => {
  await testHitAndMiss(
    sut => sut.getAssets({}),
    sut => sut.assetCollection
  )
})

test('TEST: CachedClientApi getEntries is cached', async () => {
  await testHitAndMiss(
    sut => sut.getEntries({}),
    sut => sut.entryCollection
  )
})

test('TEST: CachedClientApi getEntry is cached', async () => {
  const id = Math.random().toString()
  await testHitAndMiss(
    sut => sut.getEntry(id, {}),
    sut => sut.entry
  )
})

async function testHitAndMiss<R>(
  call: (api: CachedClientApi) => Promise<R>,
  expectedReturn: (api: MockClientApi) => R
) {
  const CACHE_TTL = 30
  const mockApi = new MockClientApi()
  const sut = new CachedClientApi(mockApi, CACHE_TTL, apiFailed)
  const expected = expectedReturn(mockApi)

  // cache hit does not perform an extra call
  await expect(call(sut)).resolves.toBe(expected)
  expect(mockApi.numCalls).toBe(1)
  await expect(call(sut)).resolves.toBe(expected)
  expect(mockApi.numCalls).toBe(1)

  // cache miss (due to timeout) performs an extra call
  await new Promise(resolve => setTimeout(resolve, CACHE_TTL + 10))
  await expect(call(sut)).resolves.toBe(expected)
  expect(mockApi.numCalls).toBe(2)
}

test('TEST: CachedClientApi does not remember exceptions', async () => {
  const CACHE_TTL = 300000
  const mockApi = new MockClientApi()
  const id = Math.random().toString()
  const query = {}
  const sut = new CachedClientApi(mockApi, CACHE_TTL, apiFailed)

  mockApi.error = new Error('forced failure')
  await expect(sut.getEntry(id, query)).rejects.toThrow(mockApi.error)

  mockApi.error = undefined
  await expect(sut.getEntry(id, query)).resolves.toBe(mockApi.entry)
})

export function apiFailed(
  description: string,
  funcName: string,
  args: any[],
  e: any
): Promise<void> {
  console.error(
    `${description}: ${funcName}(${String(args)}) threw error: ${String(e)}`
  )
  return Promise.resolve()
}
