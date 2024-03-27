import { FallbackCachedClientApi } from '../../../src/contentful/delivery/fallback-cache'
import { MockClientApi } from './mock-client.helper'

test('TEST: FallbackCachedClientApi.getAsset', async () => {
  const id = Math.random().toString()
  await testFallbackCache(
    sut => sut.getAsset(id),
    sut => sut.asset
  )
})

test('TEST: FallbackCachedClientApi.getAssets', async () => {
  await testFallbackCache(
    sut => sut.getAssets({ qk: 'qv' }),
    sut => sut.assetCollection
  )
})

test('TEST: FallbackCachedClientApi.getContentType', async () => {
  const id = Math.random().toString()
  await testFallbackCache(
    sut => sut.getContentType(id),
    sut => sut.contentType
  )
})

test('TEST: FallbackCachedClientApi.getEntries', async () => {
  await testFallbackCache(
    sut => sut.getEntries({ qk: 'qv' }),
    sut => sut.entryCollection
  )
})

test('TEST: FallbackCachedClientApi.getEntry', async () => {
  const id = Math.random().toString()
  await testFallbackCache(
    sut => sut.getEntry(id),
    sut => sut.entry
  )
})

async function testFallbackCache<R>(
  call: (api: FallbackCachedClientApi) => Promise<R>,
  expectedReturn: (api: MockClientApi) => R
) {
  await testFallbackIfFailure(call, expectedReturn)

  await testCallAfterHit(call, expectedReturn)
  await testSuccessAfterFailure(call, expectedReturn)
}

async function testCallAfterHit<R>(
  call: (api: FallbackCachedClientApi) => Promise<R>,
  expectedReturn: (api: MockClientApi) => R
) {
  const mockApi = new MockClientApi()
  const sut = new FallbackCachedClientApi(mockApi, 1, usingFallback)
  const expected = expectedReturn(mockApi)

  await expect(call(sut)).resolves.toBe(expected)
  expect(mockApi.numCalls).toBe(1)

  await expect(call(sut)).resolves.toBe(expected)
  expect(mockApi.numCalls).toBe(2)
}

async function testFallbackIfFailure<R>(
  call: (api: FallbackCachedClientApi) => Promise<R>,
  expectedReturn: (api: MockClientApi) => R
) {
  const mockApi = new MockClientApi()
  const sut = new FallbackCachedClientApi(mockApi, 1, usingFallback)
  const expected = expectedReturn(mockApi)

  await expect(call(sut)).resolves.toBe(expected)
  // expect(sut.numRecoveredErrors).toBe(0)
  expect(mockApi.numCalls).toBe(1)

  // provide last success result
  mockApi.error = new Error('forced failure')
  await expect(call(sut)).resolves.toBe(expected)
  // expect(sut.numRecoveredErrors).toBe(1)
  expect(mockApi.numCalls).toBe(2)

  mockApi.error = undefined
  await expect(call(sut)).resolves.toBe(expected)
  // expect(sut.numRecoveredErrors).toBe(1)
  expect(mockApi.numCalls).toBe(3)
}

async function testSuccessAfterFailure<R>(
  call: (api: FallbackCachedClientApi) => Promise<R>,
  expectedReturn: (api: MockClientApi) => R
) {
  const mockApi = new MockClientApi()
  const sut = new FallbackCachedClientApi(mockApi, 1, usingFallback)
  const expected = expectedReturn(mockApi)

  mockApi.error = new Error('forced failure')
  await expect(call(sut)).rejects.toThrow(mockApi.error)
  expect(mockApi.numCalls).toBe(1)

  mockApi.error = undefined
  await expect(call(sut)).resolves.toBe(expected)
  expect(mockApi.numCalls).toBe(2)
}

export function usingFallback(
  description: string,
  funcName: string,
  args: any[],
  e: any
): Promise<void> {
  console.error(
    `${description}: ${funcName}(${String(args)}) after error: ${String(e)}`
  )
  return Promise.resolve()
}

// test('TEST: CachedDelivery getAsset is cached', async () => {
//   const CACHE_TTL = 30
//   const mockApi = mock<ReducedClientApi>()
//   const id = Math.random().toString()
//   const query = {}
//   const entry = ({} as any) as Entry<any>
//   when(mockApi.getAsset(id, query)).thenResolve(entry)
//   const sut = new FallbackCachedClientApi(instance(mockApi), CACHE_TTL)
//
//   await expect(sut.getAsset(id, query)).resolves.toBe(entry)
//   await expect(sut.getAsset(id, query)).resolves.toBe(entry)
//   verify(mockApi.getAsset(id, query)).once()
//
//   await new Promise(resolve => setTimeout(resolve, CACHE_TTL))
//   await expect(sut.getAsset(id, query)).resolves.toBe(entry)
//   verify(mockApi.getAsset(id, query)).twice()
// })
