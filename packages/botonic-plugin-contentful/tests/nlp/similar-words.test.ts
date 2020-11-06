import { leven } from '@nlpjs/similarity/src'

import { NormalizedUtterance, Word } from '../../src/nlp'
import {
  CandidateWithKeywords,
  Keyword,
  MatchType,
} from '../../src/nlp/keywords'
import {
  getMatchLength,
  SimilarWordFinder,
  SimilarWordResult,
} from '../../src/nlp/similar-words'

class TestCandidate {}

function candidate(
  kws: string[],
  hasOnlyStopWords = false
): CandidateWithKeywords<TestCandidate> {
  return new CandidateWithKeywords<TestCandidate>(
    new TestCandidate(),
    kws.map(k => kw(k, hasOnlyStopWords))
  )
}

function kw(kw: string, hasOnlyStopWords = false) {
  return new Keyword(
    `${kw}`,
    kw.split(' ').map(w => new Word(w, w)),
    hasOnlyStopWords
  )
}

const CAND_HOLA = candidate(['buenos dias', 'güenas', 'ey'])
const CAND_ADIOS = candidate(['adios', 'adeu'])

function res(
  cand: CandidateWithKeywords<TestCandidate>,
  keyword: Keyword,
  match: string,
  distance: number
): SimilarWordResult<TestCandidate> {
  return new SimilarWordResult<TestCandidate>(
    cand.owner,
    keyword,
    match,
    distance
  )
}

function ut(text: string): NormalizedUtterance {
  return new NormalizedUtterance(
    text,
    text.split(' ').map(w => new Word(w, w))
  )
}

test.each<any>([
  // ['bueno dia', 2, res(CAND_HOLA, esKeyword('buenos días'), 'bueno dia', 2)], //missing 2 letters
  ['addios', 2, res(CAND_ADIOS, kw('adios'), 'addios', 1)], // 1 extra letter
  ['aidos', 2, res(CAND_ADIOS, kw('adios'), 'aidos', 2)], // 1 letter swapped
  ['afios', 2, res(CAND_ADIOS, kw('adios'), 'afios', 1)], // 1 wrong swapped
  ['adddios', 1, undefined], // too far
  ['arou', 2, undefined], // has distance 2 to adeu, but only 2 letters match
  ['ey', 1, res(CAND_HOLA, kw('ey'), 'ey', 0)], // short keyword
  ['el', 1, undefined], // similar to 'ey', but short keyword must be identical
])(
  'TEST: findSimilarKeyword(%s)',
  (
    utterance: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false)
    sut.addCandidate(CAND_ADIOS)
    sut.addCandidate(CAND_HOLA)
    const result = sut.find(
      MatchType.ONLY_KEYWORDS_FOUND,
      ut(utterance),
      maxDistance
    )
    expect(result[0]).toEqual(expectedResult)
  }
)

test('TEST: ONLY_KEYWORDS_FOUND missing space', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true)
  sut.addCandidate(CAND_ADIOS)
  sut.addCandidate(CAND_HOLA)
  const result = sut.find(MatchType.ONLY_KEYWORDS_FOUND, ut('buenosdias'), 1)
  expect(result[0].candidate).toEqual(CAND_HOLA.owner)
})

test('TEST: ONLY_KEYWORDS_FOUND stemmed checks all words in keyword', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true)
  sut.addCandidate(candidate(['realiz ped']))
  expect(sut.find(MatchType.ONLY_KEYWORDS_FOUND, ut('realiz'), 1)).toHaveLength(
    0
  )
  expect(
    sut.find(MatchType.ONLY_KEYWORDS_FOUND, ut('realizarped'), 1)
  ).toHaveLength(1)
})

test.each<any>([
  [
    'bueno dia como estamos',
    2,
    res(CAND_HOLA, kw('buenos dias'), 'bueno dia', 2),
  ], //missing 2 letters
  ['buenosdias', 1, res(CAND_HOLA, kw('buenos dias'), 'buenosdias', 1)], //missing 2 letters
  ['vale, addios', 2, res(CAND_ADIOS, kw('adios'), 'addios', 1)], // 1 extra letter
  ['esta bien aidos', 2, res(CAND_ADIOS, kw('adios'), 'aidos', 2)], // 1 letter swapped
  ['gracias. afios', 2, res(CAND_ADIOS, kw('adios'), 'afios', 1)], // 1 wrong swapped
  ['adddios amigos', 1, undefined], // too far
  ['ey amigos', 1, res(CAND_HOLA, kw('ey'), 'ey', 0)], // short keyword
  ['amic arou', 2, undefined], // arou has distance 2 to adeu, but only 2 letters match
  ['el coche', 1, undefined], // similar to 'ey', but short keyword must be identical
])(
  'TEST: findSubstring(%s)',
  (
    utterance: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false)
    sut.addCandidate(CAND_ADIOS)
    sut.addCandidate(CAND_HOLA)
    const result = sut.find(
      MatchType.KEYWORDS_AND_OTHERS_FOUND,
      ut(utterance),
      maxDistance
    )
    expect(result[0]).toEqual(expectedResult)
  }
)

test.each<any>([
  // eslint-disable-next-line prettier/prettier
  [
    [
      ['loooooooooong_match', 2],
      ['short_match', 2],
    ],
    -8,
  ],
  // eslint-disable-next-line prettier/prettier
  [
    [
      ['short_match', 2],
      ['loooooooooong_match', 2],
    ],
    8,
  ],
  // eslint-disable-next-line prettier/prettier
  [
    [
      ['loooooooooong_match', 3],
      ['short_match', 1],
    ],
    2,
  ],
  // eslint-disable-next-line prettier/prettier
  [
    [
      ['short_match', 1],
      ['loooooooooong_match', 3],
    ],
    -2,
  ],
])(
  'SimilarWordResult.compare',
  (results: [string, number][], expected: number) => {
    const buildResult = (data: [string, number]) =>
      new SimilarWordResult<number>(Math.random(), kw('kw'), data[0], data[1])
    const res1 = buildResult(results[0])
    const res2 = buildResult(results[1])

    expect(res1.compare(res2)).toEqual(expected)
  }
)

test('TEST: KEYWORDS_AND_OTHERS_FOUND gets closest match', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true)
  sut.addCandidate(candidate(['abc', 'abcdef']))
  const result = sut.find(
    MatchType.KEYWORDS_AND_OTHERS_FOUND,
    ut('xxxx abcd'),
    2
  )
  expect(result).toHaveLength(1)
  expect(result[0].distance).toEqual(1)
})

test('TEST: ONLY_KEYWORDS_FOUND gets closest match', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true)
  sut.addCandidate(candidate(['abc', 'abcdef']))
  const result = sut.find(MatchType.ONLY_KEYWORDS_FOUND, ut('abcd'), 2)
  expect(result).toHaveLength(1)
  expect(result[0].distance).toEqual(1)
})

test.each<any>([
  ['buenosdias', 2, res(CAND_HOLA, kw('buenos dias'), 'buenosdias', 1)], //missing 2 letters
  ['bueno y gran dia', 2, res(CAND_HOLA, kw('buenos dias'), 'bueno dia', 2)], //missing 2 letters
  ['dia gran y bueno', 2, res(CAND_HOLA, kw('buenos dias'), 'bueno dia', 2)], //missing 2 letters
  ['buenos', 1, undefined], // all words in keywords must match
  ['el coche', 1, undefined], // similar to 'ey', but short keyword must be identical
])(
  'TEST: ALL_WORDS_IN_KEYWORDS_MIXED_UP(%s)',
  (
    utterance: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(true)
    sut.addCandidate(CAND_ADIOS)
    sut.addCandidate(CAND_HOLA)
    const result = sut.find(
      MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP,
      ut(utterance),
      maxDistance
    )
    expect(result[0]).toEqual(expectedResult)
  }
)

test.each<any>([
  ['abc', 'abcd', 3],
  ['abc', 'abdc', 3],
  ['abc', 'abd', 2],
  ['abc', 'acb', 1],
])(
  'TEST: getMatchLength(%s, %s)',
  (w1: string, w2: string, expected: number) => {
    const distance = leven(w1, w2)
    expect(getMatchLength(w1.length, w2.length, distance)).toEqual(expected)
  }
)
