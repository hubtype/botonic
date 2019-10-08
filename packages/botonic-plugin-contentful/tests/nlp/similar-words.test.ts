import { CandidateWithKeywords, Keyword } from '../../src/nlp/keywords';
import {
  SimilarWordFinder,
  SimilarWordResult
} from '../../src/nlp/similar-words';

test('hack because webstorm does not recognize test.each', () => {});

class TestCandidate {}

function candidate(...kws: string[]): CandidateWithKeywords<TestCandidate> {
  return new CandidateWithKeywords<TestCandidate>(
    new TestCandidate(),
    kws.map(esKeyword)
  );
}
function esKeyword(kw: string) {
  return new Keyword(`raw ${kw}`, kw);
}

const CAND_HOLA = candidate('buenos dias', 'güenas', 'ey');
const CAND_ADIOS = candidate('adios', 'adeu');

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
  );
}

test.each<any>([
  // ['bueno dia', 2, res(CAND_HOLA, esKeyword('buenos días'), 'bueno dia', 2)], //missing 2 letters
  ['addios', 2, res(CAND_ADIOS, esKeyword('adios'), 'addios', 1)], // 1 extra letter
  ['aidos', 2, res(CAND_ADIOS, esKeyword('adios'), 'aidos', 2)], // 1 letter swapped
  ['afios', 2, res(CAND_ADIOS, esKeyword('adios'), 'afios', 1)], // 1 wrong swapped
  ['adddios', 1, undefined], // too far
  ['ey', 1, res(CAND_HOLA, esKeyword('ey'), 'ey', 0)], // short keyword
  ['el', 1, undefined] // short keyword must be identical
])(
  'TEST: findSimilarKeyword(%s)',
  (
    needle: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false);
    sut.addCandidate(CAND_ADIOS);
    sut.addCandidate(CAND_HOLA);
    const result = sut.findSimilarKeyword(needle, maxDistance);
    expect(result[0]).toEqual(expectedResult);
  }
);

test('TEST: findSimilarKeyword() missing space', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(CAND_ADIOS);
  sut.addCandidate(CAND_HOLA);
  const result = sut.findSimilarKeyword('buenosdias', 1);
  expect(result[0].candidate).toEqual(CAND_HOLA.owner);
});

test('TEST: findSimilarKeyword() stemmed checks all words in keyword', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(candidate('realiz ped'));
  expect(sut.findSimilarKeyword('realiz', 1)).toHaveLength(0);
  expect(sut.findSimilarKeyword('realizarped', 1)).toHaveLength(1);
});

test.each<any>([
  ['bueno dia como estamos', 2, res(CAND_HOLA, esKeyword('buenos dias'), 'bueno dia', 2)], //missing 2 letters
  ['vale, addios', 2, res(CAND_ADIOS, esKeyword('adios'), 'addios', 1)], // 1 extra letter
  ['esta bien aidos', 2, res(CAND_ADIOS, esKeyword('adios'), 'aidos', 2)], // 1 letter swapped
  ['gracias. afios', 2, res(CAND_ADIOS, esKeyword('adios'), 'afios', 1)], // 1 wrong swapped
  ['adddios amigos', 1, undefined], // too far
  ['ey amigos', 1, res(CAND_HOLA, esKeyword('ey'), 'ey', 0)], // short keyword
  ['el coche', 1, undefined] // short keyword must be identical
])(
  'TEST: findSubstring(%s)',
  (
    needle: string,
    maxDistance: number,
    expectedResult?: SimilarWordResult<TestCandidate>
  ) => {
    const sut = new SimilarWordFinder<TestCandidate>(false);
    sut.addCandidate(CAND_ADIOS);
    sut.addCandidate(CAND_HOLA);
    const result = sut.findSubstring(needle, maxDistance);
    expect(result[0]).toEqual(expectedResult);
  }
);
