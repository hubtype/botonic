import { CandidateWithKeywords } from '../../src/nlp/keywords';
import {
  SimilarWordFinder,
  SimilarWordResult
} from '../../src/nlp/similar-words';

test('hack because webstorm does not recognize test.each', () => {});

class TestCandidate {}

function candidate(...kws: string[]): CandidateWithKeywords<TestCandidate> {
  return new CandidateWithKeywords<TestCandidate>(new TestCandidate(), kws);
}

const CAND_BUENAS = candidate('buenos dias', 'güenas');
const CAND_ADIOS = candidate('adios', 'adeu');

function result(
  cand: CandidateWithKeywords<TestCandidate>,
  match: string,
  distance: number
): SimilarWordResult<TestCandidate> {
  return new SimilarWordResult<TestCandidate>(cand.owner, match, distance);
}

test.each<any>([
  ['bueno dia', 2, result(CAND_BUENAS, 'bueno dia', 2)], //missing 2 letters
  ['addios', 2, result(CAND_ADIOS, 'addios',1)], // 1 extra letter
  ['aidos', 2, result(CAND_ADIOS, 'aidos', 2)], // 1 letter swapped
  ['afios', 2, result(CAND_ADIOS, 'afios', 1)], // 1 wrong swapped
  ['adddios', 1, undefined] // too far
])(
  'TEST: findSimilarKeyword(%s)',
  (
    needle: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false);
    sut.addCandidate(CAND_ADIOS);
    sut.addCandidate(CAND_BUENAS);
    const result = sut.findSimilarKeyword(needle, maxDistance);
    expect(result[0]).toEqual(expectedResult);
  }
);

test('TEST: findSimilarKeyword() missing space', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(CAND_ADIOS);
  sut.addCandidate(CAND_BUENAS);
  const result = sut.findSimilarKeyword('buenosdias', 1);
  expect(result[0].candidate).toEqual(CAND_BUENAS.owner);
});

test('TEST: findSimilarKeyword() stemmed checks all words in keyword', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(candidate('realiz ped'));
  expect(sut.findSimilarKeyword('realiz', 1)).toHaveLength(0);
  expect(sut.findSimilarKeyword('realizarped', 1)).toHaveLength(1);
});

test.each<any>([
  ['bueno dia como estamos', 2, result(CAND_BUENAS, 'bueno dia', 2)], //missing 2 letters
  ['vale, addios', 2, result(CAND_ADIOS, 'addios',1)], // 1 extra letter
  ['esta bien aidos', 2, result(CAND_ADIOS, 'aidos', 2)], // 1 letter swapped
  ['gracias. afios', 2, result(CAND_ADIOS, 'afios', 1)], // 1 wrong swapped
  ['adddios amigos', 1, undefined] // 1 wrong swapped
])(
  'TEST: findSubstring(%s)',
  (
    needle: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>

  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false);
    sut.addCandidate(CAND_ADIOS);
    sut.addCandidate(CAND_BUENAS);
    const result = sut.findSubstring(needle, maxDistance);
    expect(result[0]).toEqual(expectedResult);
  }
);
