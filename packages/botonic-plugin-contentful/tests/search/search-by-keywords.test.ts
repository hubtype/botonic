import 'jest-extended'

import { anything, deepEqual, instance, mock, when } from 'ts-mockito'

import {
  CommonFields,
  ContentType,
  Context,
  DummyCMS,
  SearchByKeywords,
  SearchCandidate,
  SearchResult,
  TopContentId,
} from '../../src'
import { MatchType, Normalizer, StemmingBlackList } from '../../src/nlp'
import { testContentId } from '../helpers/test-data'

const ES_CONTEXT = { locale: 'es' }
test.each([
  ES_CONTEXT,
  // test locales with country
  { locale: 'es_ES' },
])('TEST: searchContentsFromInput keywords found', async () => {
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
  expectCandidates(contents, suggested, false)
  // TODO check score & match
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
  expectCandidates(contents, suggested, false)
  expect(suggested[0].match).toEqual('tas fre')
  expect(suggested[0].score).toBeWithin(0.35, 0.4)
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
  return new SearchCandidate(
    contentId,
    new CommonFields(contentId.id, contentId.id, {
      shortText: 'shortText' + contentId.id,
      keywords,
    })
  )
}

export function chitchatContent(keywords: string[]) {
  const id = Math.random().toString()
  return new SearchCandidate(
    new TopContentId(ContentType.TEXT, id),
    new CommonFields(id, id, { shortText: 'chitchat', keywords })
  )
}

export function keywordsWithMockCms(
  allContents: SearchCandidate[],
  context: Context,
  stemBlackList: { [locale: string]: StemmingBlackList[] } = {}
): SearchByKeywords {
  const mockCms = mock(DummyCMS)
  when(
    mockCms.contentsWithKeywords(deepEqual(context), anything())
  ).thenResolve(allContents)
  const normalizer = new Normalizer(stemBlackList)
  return new SearchByKeywords(instance(mockCms), normalizer)
}

function expectCandidates(
  candidates: SearchCandidate[],
  results: SearchResult[],
  inSameOrder: boolean
) {
  const candCommons = candidates.map(res => res.common)
  const resCommons = results.map(res => res.common)
  if (inSameOrder) {
    expect(resCommons).toEqual(candCommons)
  } else {
    expect(resCommons).toIncludeSameMembers(candCommons)
  }
}
