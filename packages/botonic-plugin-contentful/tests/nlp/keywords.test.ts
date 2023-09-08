import 'jest-extended'

import {
  Keyword,
  KeywordsOptions,
  KeywordsParser,
  MatchType,
  Normalizer,
  SPANISH,
  StemmingBlackList,
  Word,
} from '../../src/nlp'

test('new Keyword', () => {
  const kw1 = new Keyword(
    ' A cooker',
    [Word.StopWord('a'), new Word('cooker', 'cook')],
    false
  )
  expect(kw1.raw).toBe('a cooker')
  expect(kw1.matchString).toBe('cook')

  const kw2 = new Keyword(
    ' You are',
    [Word.StopWord('you'), Word.StopWord('are')],
    true
  )
  expect(kw2.raw).toBe('you are')
  expect(kw2.matchString).toBe('you are')
})

function testFindKeywords(
  locale: string,
  matchType: MatchType,
  maxDistance = 0,
  normalizer = new Normalizer()
) {
  return (
    inputText: string,
    keywordsByCandidate: { [index: string]: string[] },
    expectedMatch: string[]
  ) => {
    const parser = new KeywordsParser<string>(
      locale,
      matchType,
      normalizer,
      new KeywordsOptions(maxDistance)
    )

    for (const candidate in keywordsByCandidate) {
      parser.addCandidate(candidate, keywordsByCandidate[candidate])
    }
    const tokens = normalizer.normalize(locale, inputText)
    const results = parser.findCandidatesWithKeywordsAt(tokens)
    expect(results.map(r => r.candidate)).toIncludeSameMembers(expectedMatch)
  }
}

test('TEST: findCandidatesWithKeywordsAt matches tokens instead of stems if match is longer', () => {
  const normalizer = new Normalizer()
  const parser = new KeywordsParser<string>(
    SPANISH,
    MatchType.ONLY_KEYWORDS_FOUND,
    normalizer,
    new KeywordsOptions()
  )

  parser.addCandidate('candidate2', ['saluda'])
  parser.addCandidate('candidate1', ['saludos'])

  const tokens = normalizer.normalize(SPANISH, 'soludos')

  const results = parser.findCandidatesWithKeywordsAt(tokens)

  expect(results).toHaveLength(2)
  expect(results[0].match).toEqual('soludos')
  expect(results[0].distance).toEqual(1)
  expect(results[1].match).toEqual('solud')
  expect(results[1].distance).toEqual(1)
})

test.each<any>([
  ['quiero realiSar un pedido', { A: ['realizar pedido', 'comprar'] }, ['A']],
  ['venga hacerpedido', { A: ['hacer pedido', 'comprar'] }, ['A']],
])(
  'TEST: find similar keywords of "%s" with KEYWORDS_AND_OTHERS_FOUND',
  testFindKeywords('es', MatchType.KEYWORDS_AND_OTHERS_FOUND, 1)
)

test('TEST: results sorted by length with ONLY_KEYWORDS_FOUND', () =>
  testFindKeywords('es', MatchType.ONLY_KEYWORDS_FOUND, 2)(
    'abcde',
    { A: ['abc'], B: ['abXde'] },
    ['B', 'A']
  ))

test('TEST: results sorted by length with KEYWORDS_AND_OTHERS_FOUND', () =>
  testFindKeywords('es', MatchType.KEYWORDS_AND_OTHERS_FOUND, 2)(
    'words before abcde words after',
    { A: ['abc'], B: ['abXde'] },
    ['B', 'A']
  ))

test.each<any>([
  // found with multiword keyword
  ['realizar', { A: ['realizar pedido', 'comprar'] }, []],
  ['realiSar un pedido', { A: ['realizar pedido', 'comprar'] }, ['A']],
  // 'realizar' would be stemmed to 'realic', which would be too different
  ['hacerpedido', { A: ['hacerpedido', 'comprar'] }, ['A']],
  ['pedido', { A: ['realizar pedido', 'comprar'] }, []],
])(
  'TEST: find similar keywords of "%s" with ONLY_KEYWORDS_FOUND',
  testFindKeywords('es', MatchType.ONLY_KEYWORDS_FOUND, 1)
)

test.each<any>([
  // found at start with multiword keyword
  ['k w A end', { A: ['k w A', 'kwB'] }, ['A']],

  // found at end (after normalizing)
  ['start kwA. ', { A: ['kwA', 'kwB'] }, ['A']],

  // two keywords found for same model at middle
  ['start kwA1 kwA2 end', { A: ['kwA1', 'kwA2'] }, ['A']],

  // no keywords found
  ['kwC kwD', { A: ['kwA'], B: ['kwB'] }, []],

  // keywords found for 2 models
  ['kwA kwB', { A: ['kwA'], B: ['kwB'] }, ['A', 'B']],

  // keywords which only contain stopwords when input contains other (no stopwords) words
  ['Sobre enormes', { ONLY_STOPWORD: ['kw1', 'sobre'] }, ['ONLY_STOPWORD']],

  // does not false positive with keywords which only contain stopwords
  ['something else', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],

  // a keyword is shared by 2 contents
  ['informacion kw1', { A: ['kw1', 'unKw'], B: ['kw1', 'otroKw'] }, ['A', 'B']],
])(
  'TEST: find keywords of "%s" with KEYWORDS_AND_OTHERS_FOUND',
  testFindKeywords('es', MatchType.KEYWORDS_AND_OTHERS_FOUND)
)

test.each<any>([
  // acronyms
  ['o.k.', { OK: ['o.k.'] }, ['OK']],
  ['ok', { OK: ['o.k.'] }, ['OK']],
  ['o.k.', { OK: ['ok'] }, ['OK']],

  // found with multiword keyword
  ['k w A', { A: ['k w A', 'kwB'] }, ['A']],

  // found with single word
  ['kwA', { A: ['kwA', 'kwB'] }, ['A']],

  // detects keywords which only contain stopwords
  ['Sobre', { ONLY_STOPWORD: ['kw1', 'sobre'] }, ['ONLY_STOPWORD']],
  ['Como esta', { ONLY_STOPWORD: ['kw1', 'como está'] }, ['ONLY_STOPWORD']],

  // does not false positive with keywords which only contain stopwords
  ['other', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],

  // a keyword is shared by 2 contents
  ['kw1 kw2', { A: ['kw1 kw2', 'unKw'], B: ['kw1 kw2', 'otroKw'] }, ['A', 'B']],
])(
  'TEST: find keywords of "%s" with ONLY_KEYWORDS_FOUND',
  testFindKeywords('es', MatchType.ONLY_KEYWORDS_FOUND)
)

test.each<any>([
  // exact words
  ['comprar', { A: ['k w A', 'comprar'] }, ['A']],

  // different word endings
  ['compras', { A: ['k w A', 'comprar'] }, ['A']],

  // no keywords found
  ['kwC kwD', { A: ['kwA'], B: ['kwB'] }, []],

  // keywords found for 2 models
  ['kwAB', { A: ['kwAB'], B: ['kwAB'] }, ['A', 'B']],
])(
  'TEST: find keywords of "%s" for all match type',
  testFindKeywords(
    'es',
    Math.random() < 0.5
      ? MatchType.KEYWORDS_AND_OTHERS_FOUND
      : MatchType.ONLY_KEYWORDS_FOUND
  )
)

test.each<any>([
  // keyword with 3 words, words in between, different order
  ['wc foo wb bar wa', { A: ['wa wb wc', 'other'] }, ['A']],

  // keyword with 1 word, found
  ['foo wa bar', { A: ['wa', 'other'] }, ['A']],

  // keyword with 2 words, only 1 found
  ['wb', { A: ['wa wb', 'other'] }, []],

  // keywords which only contain stopwords
  ['sobre', { ONLY_STOPWORD: ['kw1', 'Sobre'] }, ['ONLY_STOPWORD']],

  // does not false positive with keywords which only contain stopwords
  ['something else', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],

  // a keyword is shared by 2 contents
  [
    'kwA enmedio kwB',
    { A: ['kwA kwB', 'unKw'], B: ['kwA kwB', 'otroKw'] },
    ['A', 'B'],
  ],
])(
  'TEST: find keywords of "%s" with ALL_WORDS_IN_KEYWORDS_MIXED_UP',
  testFindKeywords('es', MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP)
)

test('ALL_WORDS_IN_KEYWORDS_MIXED_UP', () => {
  testFindKeywords('es', MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP)(
    'sobre',
    { ONLY_STOPWORD: ['kw', 'Sobre'] },
    ['ONLY_STOPWORD']
  )
})

test('match missing space may utterance but not the keywords', () => {
  testFindKeywords('es', MatchType.ONLY_KEYWORDS_FOUND, 1)(
    'buenosdias', // stemmed to 'buenosd'
    { A: ['buenos días'] },
    ['A']
  )
})

test.each<any>([
  [MatchType.ONLY_KEYWORDS_FOUND],
  [MatchType.KEYWORDS_AND_OTHERS_FOUND],
  [MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP],
])(
  'blacklisted stems are also checked for similar words. MatchType: %s',
  (mt: MatchType) => {
    testFindKeywords(
      'es',
      mt,
      1,
      new Normalizer({ es: [new StemmingBlackList('presente', [])] })
    )('prezente', { KW1: ['presente'] }, ['KW1'])
  }
)
