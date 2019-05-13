import { KeywordsParser } from '../../src/nlp/keywords';
import 'jest-extended';

test('hack because webstorm does not recognize test.each', () => {});

test.each<any>([
  // found at start with multiword keyword
  ['k w A end', { A: ['k w A', 'kwB'] }, ['A']],
  // found at end (after normalizing)
  ['start kwA. ', { A: ['kwA', 'kwB'] }, ['A']],
  // two keywords found for same model at middle
  ['start kwA1 kwA2 end', { A: ['kwA1', 'kwA2'] }, ['A']],
  // keywords found for 2 models
  ['kwA kwB', { A: ['kwA'], B: ['kwB'] }, ['A', 'B']]
])(
  'TEST: find of "%s"',
  (
    inputText: string,
    keywordsByCandidate: { [index: string]: string[] },
    expectedMatch: string[]
  ) => {
    let parser = new KeywordsParser();

    for (let candidate in keywordsByCandidate) {
      parser.addCandidate(candidate, keywordsByCandidate[candidate]);
    }
    let foundNames = parser.findCandidatesWithKeywordsAt(inputText);
    expect(foundNames).toIncludeSameMembers(expectedMatch);
  }
);
