import 'jest-extended';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import {
  Callback,
  SearchResult,
  ContentCallback,
  DummyCMS,
  ModelType,
  SearchByKeywords,
  Context,
  CommonFields
} from '../../src';
import { SearchResult as CallbackToContentWithKeywords1 } from '../../src/search/search-result';
import { Normalizer, StemmingBlackList, MatchType } from '../../src/nlp';

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
    keywords.normalizer.normalize(
      'es',
      ' DevoluciON de  plazo? Empezar Hubtype'
    ),
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
    keywords.normalizer.normalize('es', 'Quiero el tas free'),
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
    keywords.normalizer.normalize('es', 'willnotbefound'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  );

  // assert
  expect(contents).toHaveLength(0);
});

test('TEST: searchContentsFromInput with stem blacklist', async () => {
  const keywords = keywordsWithMockCms(
    [contentWithKeyword(Callback.ofPayload('p1'), ['pedido'])],
    ES_CONTEXT,
    { es: [new StemmingBlackList('pedido', [])] }
  );

  // act
  let contents = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize('es', 'querida pedida bonita'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  );

  // assert
  expect(contents).toHaveLength(0);

  contents = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize('es', 'querido pedido bonito'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  );

  // assert
  expect(contents).toHaveLength(1);
});

export function contentWithKeyword(callback: Callback, keywords: string[]) {
  return new SearchResult(
    callback,
    new CommonFields(callback.payload!, {
      shortText: 'shortText' + callback.payload,
      keywords
    })
  );
}

export function chitchatContent(keywords: string[]) {
  const id = Math.random().toString();
  return new SearchResult(
    new ContentCallback(ModelType.TEXT, id),
    new CommonFields(id, { shortText: 'chitchat', keywords })
  );
}

export function keywordsWithMockCms(
  allContents: CallbackToContentWithKeywords1[],
  context: Context,
  stemBlackList: { [locale: string]: StemmingBlackList[] } = {}
): SearchByKeywords {
  const mockCms = mock(DummyCMS);
  when(mockCms.contentsWithKeywords(deepEqual(context))).thenResolve(
    allContents
  );
  const normalizer = new Normalizer(stemBlackList);
  return new SearchByKeywords(instance(mockCms), normalizer);
}
