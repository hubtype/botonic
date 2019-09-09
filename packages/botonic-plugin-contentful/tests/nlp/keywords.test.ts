import 'jest-extended';
import { KeywordsParser, tokenizeAndStem } from '../../src/nlp';
import { MatchType } from '../../src/nlp/keywords';

test('hack because webstorm does not recognize test.each', () => {});

function testFindKeywords(
  locale: string,
  matchType: MatchType,
  maxDistance = 0
) {
  return (
    inputText: string,
    keywordsByCandidate: { [index: string]: string[] },
    expectedMatch: string[]
  ) => {
    const parser = new KeywordsParser(locale, matchType, { maxDistance });

    for (const candidate in keywordsByCandidate) {
      parser.addCandidate(candidate, keywordsByCandidate[candidate]);
    }
    const tokens = tokenizeAndStem(locale, inputText);
    const foundNames = parser.findCandidatesWithKeywordsAt(tokens);
    expect(foundNames).toIncludeSameMembers(expectedMatch);
  };
}

test.each<any>([
  ['quiero realiSar un pedido', { A: ['realizar pedido', 'comprar'] }, ['A']],
  ['venga realizarpedido', { A: ['realizar pedido', 'comprar'] }, ['A']]
])(
  'TEST: find similar keywords of "%s" with KEYWORDS_AND_OTHERS_FOUND',
  testFindKeywords('es', MatchType.KEYWORDS_AND_OTHERS_FOUND, 1)
);

test.each<any>([
  // found with multiword keyword
  ['realizar', { A: ['realizar pedido', 'comprar'] }, []],
  ['realiSar un pedido', { A: ['realizar pedido', 'comprar'] }, ['A']],
  ['realizarpedido', { A: ['realizar pedido', 'comprar'] }, ['A']],
  ['pedido', { A: ['realizar pedido', 'comprar'] }, []]
])(
  'TEST: find similar keywords of "%s" with ONLY_KEYWORDS_FOUND',
  testFindKeywords('es', MatchType.ONLY_KEYWORDS_FOUND, 1)
);


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

  // BUG does not detect keywords which only contain stopwords when input contains other (no stopwords) words
  ['sobres enormes', { ONLY_STOPWORD: ['kw1', 'sobre'] }, []],

  // does not false positive with keywords which only contain stopwords
  ['something else', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],
  ['', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],

  // a keyword is shared by 2 contents
  ['informacion kw1', { A: ['kw1', 'unKw'], B: ['kw1', 'otroKw'] }, ['A', 'B']]
])(
  'TEST: find keywords of "%s" with KEYWORDS_AND_OTHERS_FOUND',
  testFindKeywords('es', MatchType.KEYWORDS_AND_OTHERS_FOUND)
);

test.each<any>([
  // found with multiword keyword
  ['k w A', { A: ['k w A', 'kwB'] }, ['A']],

  // found with single word
  ['kwA', { A: ['kwA', 'kwB'] }, ['A']],

  // detects keywords which only contain stopwords
  ['sobres', { ONLY_STOPWORD: ['kw1', 'sobre'] }, ['ONLY_STOPWORD']],

  // does not false positive with keywords which only contain stopwords
  ['other', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],
  ['', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],

  // a keyword is shared by 2 contents
  ['kw1 kw2', { A: ['kw1 kw2', 'unKw'], B: ['kw1 kw2', 'otroKw'] }, ['A', 'B']]
])(
  'TEST: find keywords of "%s" with ONLY_KEYWORDS_FOUND',
  testFindKeywords('es', MatchType.ONLY_KEYWORDS_FOUND)
);


test.each<any>([
  // exact words
  ['comprar', { A: ['k w A', 'comprar'] }, ['A']],

  // different word endings
  ['compras', { A: ['k w A', 'comprar'] }, ['A']],

  // no keywords found
  ['kwC kwD', { A: ['kwA'], B: ['kwB'] }, []],

  // keywords found for 2 models
  ['kwAB', { A: ['kwAB'], B: ['kwAB'] }, ['A', 'B']]
])(
  'TEST: find keywords of "%s" for all match type',
  testFindKeywords(
    'es',
    Math.random() < 0.5
      ? MatchType.KEYWORDS_AND_OTHERS_FOUND
      : MatchType.ONLY_KEYWORDS_FOUND
  )
);

test.each<any>([
  // keyword with 3 words, words in between, different order
  ['wc foo wb bar wa', { A: ['wa wb wc', 'other'] }, ['A']],

  // keyword with 1 word, found
  ['foo wa bar', { A: ['wa', 'other'] }, ['A']],

  // keyword with 2 words, only 1 found
  ['wb', { A: ['wa wb', 'other'] }, []],

  // keywords which only contain stopwords
  ['sobres', { ONLY_STOPWORD: ['kw1', 'sobre'] }, ['ONLY_STOPWORD']],

  // does not false positive with keywords which only contain stopwords
  ['something else', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],
  ['', { ONLY_STOPWORD: ['kw1', 'otro'] }, []],

  // a keyword is shared by 2 contents
  [
    'kw1 enmedio kw2',
    { A: ['kw1 kw2', 'unKw'], B: ['kw1 kw2', 'otroKw'] },
    ['A', 'B']
  ]
])(
  'TEST: find keywords of "%s" with ALL_WORDS_IN_KEYWORDS_MIXED_UP',
  testFindKeywords('es', MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP)
);
