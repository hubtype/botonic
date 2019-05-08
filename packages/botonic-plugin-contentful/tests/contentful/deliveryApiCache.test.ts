import { EntryCollection } from 'contentful';
import { string } from 'prop-types';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { ContentNotFoundException } from '../../src/cms';
import * as cms from '../../src/cms';
import { CachedDeliveryApi } from '../../src/contentful/deliveryApiCache';
import { TextFields } from '../../src/contentful/text';
import { delay } from '../helpers/async';
import {
  DummyContentfulClientApi,
  entry,
  entryCollection
} from '../helpers/contentful';

function mockRefreshCache(
  mockApi: DummyContentfulClientApi,
  modelType: cms.ModelType,
  entryCollections: EntryCollection<any>[]
) {
  let w = when(
    mockApi.getEntries(
      deepEqual({
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: modelType
      })
    )
  );
  for (let entryCollection of entryCollections) {
    w = w.thenResolve(entryCollection);
  }
}

test('TEST: contentful cache only refreshes when necessary', async () => {
  let mockApi = mock(DummyContentfulClientApi);
  const ID = mock(string);
  let mockEntry1 = entry(ID, cms.ModelType.TEXT, 'name1');
  let mockEntry2 = entry(ID, cms.ModelType.TEXT, 'name2');
  mockRefreshCache(mockApi, cms.ModelType.TEXT, [
    entryCollection(mockEntry1),
    entryCollection(mockEntry2)
  ]);
  mockRefreshCache(mockApi, cms.ModelType.CAROUSEL, [entryCollection()]);
  let sut = new CachedDeliveryApi(instance(mockApi), 100);

  // while TTL has not expired, expect what getEntries returned the first time
  for (let {} of [1, 2]) {
    await expect(sut.getEntry(ID)).resolves.toBe(mockEntry1);
    await expect(
      sut.getEntryByIdOrName<TextFields>(ID, cms.ModelType.TEXT)
    ).resolves.toBe(mockEntry1);
    await expect(
      sut.getEntryByIdOrName<TextFields>('name1', cms.ModelType.TEXT)
    ).resolves.toBe(mockEntry1);
  }
  // after expiration
  await delay(101);

  // expect the return of the second getEntries invocation
  await expect(sut.getEntry(ID)).resolves.toBe(mockEntry2);
  await expect(
    sut.getEntryByIdOrName<TextFields>('name2', cms.ModelType.TEXT)
  ).resolves.toBe(mockEntry2);
});

test('TEST: contentful cache throws when not found', async () => {
  let mockApi = mock(DummyContentfulClientApi);
  const ID = mock(string);
  let mockEntry1 = entry(ID, cms.ModelType.TEXT, 'name1');
  mockRefreshCache(mockApi, cms.ModelType.TEXT, [entryCollection(mockEntry1)]);
  mockRefreshCache(mockApi, cms.ModelType.CAROUSEL, [entryCollection()]);
  let sut = new CachedDeliveryApi(instance(mockApi), 100);

  await expect(sut.getEntry('other id')).rejects.toThrow(
    new ContentNotFoundException('When looking for ' + { id: 'other id' })
  );
  await expect(
    sut.getEntryByIdOrName('other name', cms.ModelType.TEXT)
  ).rejects.toThrow(
    new ContentNotFoundException(
      'When looking for ' + { idOrName: 'other id', contentType: 'text' }
    )
  );
});
