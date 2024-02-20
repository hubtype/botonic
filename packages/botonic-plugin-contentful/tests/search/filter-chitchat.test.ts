import 'jest-extended'

import { MatchType } from '../../src/nlp'
import { testContentId } from '../helpers/test-data'
import {
  chitchatContent,
  contentWithKeyword,
  keywordsWithMockCms,
} from './search-by-keywords.test'

const LOCALE = 'es'
const CONTEXT = { locale: LOCALE }

test.each<any>([
  //@bug it recognizes only 1 chitchat because both keywords belong to same content
  //['buenos dias como esta no_reconocido no_reconocido!', 2],
  ['buenos dias hasta luego noReconocido noReconocido!', 2],
  ['hey adios noReconocido', 2],
  ['hey noReconocido', 1],
  ['hey adios noReconocido noReconocido', 2],
])(
  'treatChitChat(%s): only filtered keywords, plus aprox <=2 non recognized tokens',
  async (inputText: string, numChitchats: number) => {
    const keywords = keywordsWithMockCms(
      [
        chitchatContent(['hey', 'buenos dias']),
        chitchatContent(['adios', 'hasta luego']),
      ],
      CONTEXT
    )
    const normalized = keywords.normalizer.normalize(LOCALE, inputText)
    const contents = await keywords.searchContentsFromInput(
      normalized,
      MatchType.KEYWORDS_AND_OTHERS_FOUND,
      { locale: 'es' }
    )
    expect(contents).toHaveLength(numChitchats)

    // act
    const filtered = keywords.filterChitchat(normalized.words, contents)

    // assert
    expect(filtered).toHaveLength(1)
    filtered.forEach(filtered => {
      expect(filtered.getCallbackIfChitchat()).not.toBeUndefined()
    })
  }
)

test('TEST: treatChitChat: chitchat and other keywords detected', async () => {
  const keywords = keywordsWithMockCms(
    [
      chitchatContent(['hey', 'buenos dias']),
      contentWithKeyword(testContentId(), ['devolucion']),
    ],
    CONTEXT
  )
  const normalized = keywords.normalizer.normalize(
    LOCALE,
    'hey, DevoluciON fuera de  plazo?'
  )
  const parsedKeywords = await keywords.searchContentsFromInput(
    normalized,
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    { locale: LOCALE }
  )
  expect(parsedKeywords).toHaveLength(2)

  // act
  const filtered = keywords.filterChitchat(normalized.words, parsedKeywords)

  // assert
  expect(filtered).toHaveLength(1)
  expect(filtered[0].getCallbackIfChitchat()).toBeUndefined()
})

test.each<any>([
  //@bug it recognizes only 1 chitchat because both keywords belong to same content
  //['buenos dias como esta no_reconocido no_reconocido no_reconocido!', 2],
  ['buenos dias hasta luego no_reconocido no_reconocido no_reconocido!', 2],
  ['hey no_reconocido no_reconocido no_reconocido no_reconocido', 1],
  ['hey asdhas sad asd dsa', 1],
])(
  'treatChitChat: chitchats detected, plus aprox >2 non recognized tokens => ask user to repeat',
  async (inputText: string, numChitChats: number) => {
    const keywords = keywordsWithMockCms(
      [
        chitchatContent(['hey', 'buenos dias']),
        chitchatContent(['hasta luego']),
      ],
      CONTEXT
    )
    const normalized = keywords.normalizer.normalize(LOCALE, inputText)

    const contents = await keywords.searchContentsFromInput(
      normalized,
      MatchType.KEYWORDS_AND_OTHERS_FOUND,
      { locale: LOCALE }
    )
    expect(contents).toHaveLength(numChitChats)

    // act
    const filtered = keywords.filterChitchat(normalized.words, contents)

    // assert
    expect(filtered).toEqual([])
  }
)

test('TEST: treatChitChat: no chitchat detected', async () => {
  const keywords = keywordsWithMockCms(
    [
      chitchatContent(['hey']),
      contentWithKeyword(testContentId(), ['devolucion']),
    ],
    CONTEXT
  )

  // hola is a stopword
  const normalized = keywords.normalizer.normalize(
    LOCALE,
    'hola, DevoluciON fuera de  plazo'
  )
  const contents = await keywords.searchContentsFromInput(
    normalized,
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    { locale: LOCALE }
  )
  expect(contents).toHaveLength(1)

  // act
  const filtered = keywords.filterChitchat(normalized.words, contents)

  // assert
  expect(filtered).toBe(contents)
})

test('TEST: treatChitChat: keyword is a stopword', async () => {
  const keywords = keywordsWithMockCms(
    [
      chitchatContent(['hola']),
      chitchatContent(['adios']),
      chitchatContent(['buenos dias']),
    ],
    CONTEXT
  )

  // it matches hola with holi even when it's a stopword
  const normalized = keywords.normalizer.normalize(
    LOCALE,
    'Holi, adios, buenos días.'
  )
  const contents = await keywords.searchContentsFromInput(
    normalized,
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    { locale: LOCALE }
  )
  expect(contents).toHaveLength(3)

  // act
  const filtered = keywords.filterChitchat(normalized.words, contents)

  // assert
  expect(filtered).toEqual([contents[0]])
})
