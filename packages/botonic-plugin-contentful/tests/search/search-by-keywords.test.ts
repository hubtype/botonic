import 'jest-extended'
import { deepEqual, instance, mock, when } from 'ts-mockito'
import {
  SearchResult,
  TopContentId,
  DummyCMS,
  ContentType,
  SearchByKeywords,
  Context,
  CommonFields,
} from '../../src'
import { SearchResult as CallbackToContentWithKeywords1 } from '../../src/search/search-result'
import { Normalizer, StemmingBlackList, MatchType } from '../../src/nlp'
import { testContentId } from '../helpers/test-data'

const ES_CONTEXT = { locale: 'es' }
test('TEST: searchContentsFromInput keywords found', async () => {
  const contents = [
    contentWithKeyword(testContentId(), ['kw1', 'devolucion plazo']),
    contentWithKeyword(testContentId(), ['devolución', 'kw2']),
    contentWithKeyword(testContentId(), ['Empezar']),
  ]
  const keywords = keywordsWithMockCms(
    [...contents, contentWithKeyword(testContentId(), ['not_found'])],
    ES_CONTEXT
  )

  // act
  const suggested = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize(
      'es',
      ' DevoluciON de  plazo? Empezar Hubtype'
    ),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  )

  // assert
  expect(suggested).toIncludeSameMembers(contents)
})

test('TEST: searchContentsFromInput similar', async () => {
  const contents = [contentWithKeyword(testContentId(), ['tax free'])]
  const keywords = keywordsWithMockCms(contents, ES_CONTEXT)

  // act
  const suggested = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize('es', 'Quiero el tas free'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  )

  // assert
  expect(suggested).toEqual(contents)
})

test('TEST: searchContentsFromInput no keywords found', async () => {
  const keywords = keywordsWithMockCms(
    [contentWithKeyword(testContentId(), ['kw1', 'kw2'])],
    ES_CONTEXT
  )

  // act
  const contents = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize('es', 'willnotbefound'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  )

  // assert
  expect(contents).toHaveLength(0)
})

test('TEST: searchContentsFromInput with stem blacklist', async () => {
  const keywords = keywordsWithMockCms(
    [contentWithKeyword(testContentId(), ['pedido'])],
    ES_CONTEXT,
    { es: [new StemmingBlackList('pedido', [])] }
  )

  // act
  let contents = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize('es', 'pedí que me llamarais'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  )

  // assert
  expect(contents).toHaveLength(0)

  contents = await keywords.searchContentsFromInput(
    keywords.normalizer.normalize('es', 'querido pedido bonito'),
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ES_CONTEXT
  )

  // assert
  expect(contents).toHaveLength(1)
})

export function contentWithKeyword(
  contentId: TopContentId,
  keywords: string[]
) {
  return new SearchResult(
    contentId,
    new CommonFields(contentId.id, contentId.id, {
      shortText: 'shortText' + contentId.id,
      keywords,
    })
  )
}

export function chitchatContent(keywords: string[]) {
  const id = Math.random().toString()
  return new SearchResult(
    new TopContentId(ContentType.TEXT, id),
    new CommonFields(id, id, { shortText: 'chitchat', keywords })
  )
}

export function keywordsWithMockCms(
  allContents: CallbackToContentWithKeywords1[],
  context: Context,
  stemBlackList: { [locale: string]: StemmingBlackList[] } = {}
): SearchByKeywords {
  const mockCms = mock(DummyCMS)
  when(mockCms.contentsWithKeywords(deepEqual(context))).thenResolve(
    allContents
  )
  const normalizer = new Normalizer(stemBlackList)
  return new SearchByKeywords(instance(mockCms), normalizer)
}
