import 'jest-extended';
import { instance, mock, when } from 'ts-mockito';
import {
  Callback,
  CallbackToContentWithKeywords,
  ContentCallback,
  ContentWithKeywords,
  DummyCMS,
  ModelType,
  SearchByKeywords
} from '../../src';
import { default as cms } from '../../src/cms';
import { MatchType } from '../../src/nlp/keywords';

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
  return new CallbackToContentWithKeywords(callback, {
    name: callback.payload,
    shortText: 'shortText' + callback.payload,
    keywords
  } as ContentWithKeywords);
}

export function chitchatContent(keywords: string[]) {
  let id = Math.random().toString();
  return new CallbackToContentWithKeywords(
    new ContentCallback(ModelType.TEXT, id),
    {
      name: id,
      shortText: 'chitchat',
      keywords
    } as ContentWithKeywords
  );
}

export function keywordsWithMockCms(
  allContents: cms.CallbackToContentWithKeywords[]
): SearchByKeywords {
  let mockCms = mock(DummyCMS);
  when(mockCms.contentsWithKeywords()).thenResolve(allContents);
  return new SearchByKeywords(instance(mockCms));
}
