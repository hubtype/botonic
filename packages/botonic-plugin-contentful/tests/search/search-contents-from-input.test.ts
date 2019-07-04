import 'jest-extended';
import { anything, instance, mock, when } from 'ts-mockito';
import {
  Callback,
  SearchResult,
  ContentCallback,
  DummyCMS,
  ModelType,
  SearchByKeywords
} from '../../src';
import { MatchType } from '../../src/nlp/keywords';
import { SearchResult as CallbackToContentWithKeywords1 } from '../../src/search/search-result';

test('TEST: suggestTextsForInput keywords found', async () => {
  let contents = [
    contentWithKeyword(Callback.ofPayload('p1'), ['kw1', 'devolucion plazo']),
    contentWithKeyword(Callback.ofPayload('p2'), ['devolución', 'kw2']),
    contentWithKeyword(Callback.ofPayload('p3'), ['Empezar']),
    contentWithKeyword(Callback.ofUrl('http...'), ['hubtype']),
    contentWithKeyword(Callback.ofPayload('p4'), ['not_found'])
  ];
  let keywords = keywordsWithMockCms(contents);

  // act
  let expectedContents = contents.slice(0, 4);
  let suggested = await keywords.searchContentsFromInput(
    keywords.tokenize(' DevoluciON de  plazo? Empezar Hubtype'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND
  );

  // assert
  expect(suggested).toIncludeSameMembers(expectedContents);
});

test('TEST: suggestTextsForInput no keywords found', async () => {
  let keywords = keywordsWithMockCms([
    contentWithKeyword(Callback.ofPayload('p1'), ['kw1', 'kw2'])
  ]);

  // act
  let contents = await keywords.searchContentsFromInput(
    keywords.tokenize('willnotbefound'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND
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
  let id = Math.random().toString();
  return new SearchResult(
    new ContentCallback(ModelType.TEXT, id),
    id,
    'chitchat',
    keywords
  );
}

export function keywordsWithMockCms(
  allContents: CallbackToContentWithKeywords1[]
): SearchByKeywords {
  let mockCms = mock(DummyCMS);
  when(mockCms.contentsWithKeywords(anything())).thenResolve(allContents);
  return new SearchByKeywords(instance(mockCms));
}
