import { CachedClientApi } from '../../../src/contentful/delivery/cache'
import { instance, mock, verify, when } from 'ts-mockito'
import { Entry, EntryCollection } from 'contentful'
import { ReducedClientApi } from '../../../src/contentful/delivery/client-api'

test('TEST: CachedDelivery getEntries', async () => {
  const CACHE_TTL = 30
  const mockApi = mock<ReducedClientApi>()
  const query = {}
  const entryCollection = ({
    items: [],
  } as any) as EntryCollection<any>
  when(mockApi.getEntries(query)).thenResolve(entryCollection)
  const sut = new CachedClientApi(instance(mockApi), CACHE_TTL)

  await expect(sut.getEntries(query)).resolves.toBe(entryCollection)
  await expect(sut.getEntries(query)).resolves.toBe(entryCollection)
  verify(mockApi.getEntries(query)).once()

  await new Promise(resolve => setTimeout(resolve, CACHE_TTL))
  await expect(sut.getEntries(query)).resolves.toBe(entryCollection)
  verify(mockApi.getEntries(query)).twice()
})

test('TEST: CachedDelivery getEntry', async () => {
  const CACHE_TTL = 30
  const mockApi = mock<ReducedClientApi>()
  const id = Math.random().toString()
  const query = {}
  const entry = ({} as any) as Entry<any>
  when(mockApi.getEntry(id, query)).thenResolve(entry)
  const sut = new CachedClientApi(instance(mockApi), CACHE_TTL)

  await expect(sut.getEntry(id, query)).resolves.toBe(entry)
  await expect(sut.getEntry(id, query)).resolves.toBe(entry)
  verify(mockApi.getEntry(id, query)).once()

  await new Promise(resolve => setTimeout(resolve, CACHE_TTL))
  await expect(sut.getEntry(id, query)).resolves.toBe(entry)
  verify(mockApi.getEntry(id, query)).twice()
})

test('TEST: CachedDelivery getAsset', async () => {
  const CACHE_TTL = 30
  const mockApi = mock<ReducedClientApi>()
  const id = Math.random().toString()
  const query = {}
  const entry = ({} as any) as Entry<any>
  when(mockApi.getAsset(id, query)).thenResolve(entry)
  const sut = new CachedClientApi(instance(mockApi), CACHE_TTL)

  await expect(sut.getAsset(id, query)).resolves.toBe(entry)
  await expect(sut.getAsset(id, query)).resolves.toBe(entry)
  verify(mockApi.getAsset(id, query)).once()

  await new Promise(resolve => setTimeout(resolve, CACHE_TTL))
  await expect(sut.getAsset(id, query)).resolves.toBe(entry)
  verify(mockApi.getAsset(id, query)).twice()
})
