import 'jest-extended';
import { KeywordsParser, tokenizeAndStem } from '../../src/nlp';
import { MatchType } from '../../src/nlp/keywords';

test('hack because webstorm does not recognize test.each', () => {});

function testFindKeywords(matchType: MatchType) {
  return (
    inputText: string,
    keywordsByCandidate: { [index: string]: string[] },
    expectedMatch: string[]
  ) => {
    let parser = new KeywordsParser('es', matchType);

    for (let candidate in keywordsByCandidate) {
      parser.addCandidate(candidate, keywordsByCandidate[candidate]);
    }
    let tokens = tokenizeAndStem('es', inputText);
    let foundNames = parser.findCandidatesWithKeywordsAt(tokens);
    expect(foundNames).toIncludeSameMembers(expectedMatch);
  };
}

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
  ['kwA kwB', { A: ['kwA'], B: ['kwB'] }, ['A', 'B']]
])(
  'TEST: find keywords of "%s" with KEYWORDS_AND_OTHERS_FOUND',
  testFindKeywords(MatchType.KEYWORDS_AND_OTHERS_FOUND)
);

test.each<any>([
  // found with multiword keyword
  ['k w A', { A: ['k w A', 'kwB'] }, ['A']],
  // found with single word
  ['kwA', { A: ['kwA', 'kwB'] }, ['A']]
])(
  'TEST: find keywords of "%s" with ONLY_KEYWORDS_FOUND',
  testFindKeywords(MatchType.ONLY_KEYWORDS_FOUND)
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
  ['wb', { A: ['wa wb', 'other'] }, []]
])(
  'TEST: find keywords of "%s" with ONLY_KEYWORDS_FOUND',
  testFindKeywords(MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP)
);
