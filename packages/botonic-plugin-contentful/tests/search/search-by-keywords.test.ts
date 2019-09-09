import 'jest-extended';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import {
  Callback,
  SearchResult,
  ContentCallback,
  DummyCMS,
  ModelType,
  SearchByKeywords,
  Context
} from '../../src';
import { MatchType } from '../../src/nlp/keywords';
import { SearchResult as CallbackToContentWithKeywords1 } from '../../src/search/search-result';

const ES_CONTEXT = { locale: 'es' };
test('TEST: searchContentsFromInput keywords found', async () => {
  const contents = [
    contentWithKeyword(Callback.ofPayload('p1'), ['kw1', 'devolucion plazo']),
    contentWithKeyword(Callback.ofPayload('p2'), ['devolución', 'kw2']),
    contentWithKeyword(Callback.ofPayload('p3'), ['Empezar']),
    contentWithKeyword(Callback.ofUrl('http...'), ['hubtype']),
    contentWithKeyword(Callback.ofPayload('p4'), ['not_found'])
  ];
  const keywords = keywordsWithMockCms(contents, ES_CONTEXT);

  // act
  const expectedContents = contents.slice(0, 4);
  const suggested = await keywords.searchContentsFromInput(
    keywords.tokenize('es', ' DevoluciON de  plazo? Empezar Hubtype'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  );

  // assert
  expect(suggested).toIncludeSameMembers(expectedContents);
});

test('TEST: searchContentsFromInput similar', async () => {
  const contents = [contentWithKeyword(Callback.ofPayload('p1'), ['tax free'])];
  const keywords = keywordsWithMockCms(contents, ES_CONTEXT);

  // act
  const suggested = await keywords.searchContentsFromInput(
    keywords.tokenize('es', 'Quiero el tas free'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  );

  // assert
  expect(suggested).toEqual(contents);
});

test('TEST: searchContentsFromInput no keywords found', async () => {
  const keywords = keywordsWithMockCms(
    [contentWithKeyword(Callback.ofPayload('p1'), ['kw1', 'kw2'])],
    ES_CONTEXT
  );

  // act
  const contents = await keywords.searchContentsFromInput(
    keywords.tokenize('es', 'willnotbefound'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  );

  // assert
  expect(contents).toHaveLength(0);
});

export function contentWithKeyword(callback: Callback, keywords: string[]) {
  return new SearchResult(
    callback,
    callback.payload!,
    'shortText' + callback.payload,
    keywords
  );
}

export function chitchatContent(keywords: string[]) {
  const id = Math.random().toString();
  return new SearchResult(
    new ContentCallback(ModelType.TEXT, id),
    id,
    'chitchat',
    keywords
  );
}

export function keywordsWithMockCms(
  allContents: CallbackToContentWithKeywords1[],
  context: Context
): SearchByKeywords {
  const mockCms = mock(DummyCMS);
  when(mockCms.contentsWithKeywords(deepEqual(context))).thenResolve(
    allContents
  );
  return new SearchByKeywords(instance(mockCms));
}
