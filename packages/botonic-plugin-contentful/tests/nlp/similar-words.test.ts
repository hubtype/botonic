import { CandidateWithKeywords } from '../../src/nlp/keywords';
import { SimilarWordFinder } from '../../src/nlp/similar-words';

test('hack because webstorm does not recognize test.each', () => {});

class TestCandidate {}

function candidate(...kws: string[]): CandidateWithKeywords<TestCandidate> {
  return new CandidateWithKeywords<TestCandidate>(new TestCandidate(), kws);
}

const CAND_BUENAS = candidate('buenos dias', 'güenas');
const CAND_ADIOS = candidate('adios', 'adeu');

test.each<any>([
  ['bueno dia', 2, CAND_BUENAS, 2], //missing 2 letters
  ['addios', 2, CAND_ADIOS, 1], // 1 extra letter
  ['aidos', 2, CAND_ADIOS, 2], // 1 letter swapped
  ['afios', 2, CAND_ADIOS, 1], // 1 wrong swapped
  ['adddios', 1, undefined, undefined] // too far
])(
  'TEST: findSimilarKeyword(%s)',
  (
    needle: string,
    maxDistance: number,
    expectedCandidate?: CandidateWithKeywords<TestCandidate>,
    expectedDistance?: number
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false);
    sut.addCandidate(CAND_ADIOS);
    sut.addCandidate(CAND_BUENAS);
    const result = sut.findSimilarKeyword(needle, maxDistance);
    if (expectedCandidate) {
      expect(result[0].candidate).toEqual(expectedCandidate);
      expect(result[0].distance).toEqual(expectedDistance);
    } else {
      expect(result).toHaveLength(0);
    }
  }
);

test('TEST: findSimilarKeyword(%s) stemmed', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(CAND_ADIOS);
  sut.addCandidate(CAND_BUENAS);
  const result = sut.findSimilarKeyword('buenosdias', 1);
  expect(result[0].candidate).toEqual(CAND_BUENAS);
});

test('TEST: findSimilarKeyword(%s) stemmed checks all words in keyword', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(candidate('realiz ped'));
  expect(sut.findSimilarKeyword('realiz', 1)).toHaveLength(0);
  expect(sut.findSimilarKeyword('realizarped', 1)).toHaveLength(1);
});

test.each<any>([
  ['bueno dia como estamos', 2, CAND_BUENAS, 2], //missing 2 letters
  ['vale, addios', 2, CAND_ADIOS, 1], // 1 extra letter
  ['esta bien aidos', 2, CAND_ADIOS, 2], // 1 letter swapped
  ['gracias. afios', 2, CAND_ADIOS, 1], // 1 wrong swapped
  ['adddios amigos', 1, undefined, undefined] // 1 wrong swapped
])(
  'TEST: findSubstring(%s)',
  (
    needle: string,
    maxDistance: number,
    expectedCandidate?: CandidateWithKeywords<TestCandidate>,
    expectedDistance?: number
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false);
    sut.addCandidate(CAND_ADIOS);
    sut.addCandidate(CAND_BUENAS);
    const result = sut.findSubstring(needle, maxDistance);
    if (expectedCandidate && expectedDistance) {
      expect(result[0].candidate).toEqual(expectedCandidate);
      expect(result[0].distance).toBeCloseTo(expectedDistance);
    } else {
      expect(result).toHaveLength(0);
    }
  }
);
