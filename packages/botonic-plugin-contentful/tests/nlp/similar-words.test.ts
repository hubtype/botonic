import { CandidateWithKeywords, Keyword } from '../../src/nlp/keywords';
import {
  SimilarWordFinder,
  SimilarWordResult
} from '../../src/nlp/similar-words';
import { NormalizedUtterance } from '../../src/nlp';

test('hack because webstorm does not recognize test.each', () => {});

class TestCandidate {}

function candidate(...kws: string[]): CandidateWithKeywords<TestCandidate> {
  return new CandidateWithKeywords<TestCandidate>(
    new TestCandidate(),
    kws.map(kw)
  );
}
function kw(kw: string) {
  return new Keyword(`raw ${kw}`, kw, false);
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

function ut(text: string): NormalizedUtterance {
  return new NormalizedUtterance(text, [text], text.split(' '));
}

test.each<any>([
  // ['bueno dia', 2, res(CAND_HOLA, esKeyword('buenos días'), 'bueno dia', 2)], //missing 2 letters
  ['addios', 2, res(CAND_ADIOS, kw('adios'), 'addios', 1)], // 1 extra letter
  ['aidos', 2, res(CAND_ADIOS, kw('adios'), 'aidos', 2)], // 1 letter swapped
  ['afios', 2, res(CAND_ADIOS, kw('adios'), 'afios', 1)], // 1 wrong swapped
  ['adddios', 1, undefined], // too far
  ['ey', 1, res(CAND_HOLA, kw('ey'), 'ey', 0)], // short keyword
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
    const result = sut.findIfOnlyWordsFromKeyword(ut(needle), maxDistance);
    expect(result[0]).toEqual(expectedResult);
  }
);

test('TEST: findSimilarKeyword() missing space', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(CAND_ADIOS);
  sut.addCandidate(CAND_HOLA);
  const result = sut.findIfOnlyWordsFromKeyword(ut('buenosdias'), 1);
  expect(result[0].candidate).toEqual(CAND_HOLA.owner);
});

test('TEST: findSimilarKeyword() stemmed checks all words in keyword', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(candidate('realiz ped'));
  expect(sut.findIfOnlyWordsFromKeyword(ut('realiz'), 1)).toHaveLength(0);
  expect(sut.findIfOnlyWordsFromKeyword(ut('realizarped'), 1)).toHaveLength(1);
});

test.each<any>([
  [
    'bueno dia como estamos',
    2,
    res(CAND_HOLA, kw('buenos dias'), 'bueno dia', 2)
  ], //missing 2 letters
  ['vale, addios', 2, res(CAND_ADIOS, kw('adios'), 'addios', 1)], // 1 extra letter
  ['esta bien aidos', 2, res(CAND_ADIOS, kw('adios'), 'aidos', 2)], // 1 letter swapped
  ['gracias. afios', 2, res(CAND_ADIOS, kw('adios'), 'afios', 1)], // 1 wrong swapped
  ['adddios amigos', 1, undefined], // too far
  ['ey amigos', 1, res(CAND_HOLA, kw('ey'), 'ey', 0)], // short keyword
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
    const result = sut.findSubstring(ut(needle), maxDistance);
    expect(result[0]).toEqual(expectedResult);
  }
);

test.each<any>([
  [[['loooooooooong_match', 2], ['short_match', 2]], -8],
  [[['short_match', 2], ['loooooooooong_match', 2]], 8],
  [[['loooooooooong_match', 3], ['short_match', 1]], 2],
  [[['short_match', 1], ['loooooooooong_match', 3]], -2]
])(
  'SimilarWordResult.compare',
  (results: [string, number][], expected: number) => {
    const buildResult = (data: [string, number]) =>
      new SimilarWordResult<number>(Math.random(), kw('kw'), data[0], data[1]);
    const res1 = buildResult(results[0]);
    const res2 = buildResult(results[1]);

    expect(res1.compare(res2)).toEqual(expected);
  }
);

test('TEST: findSubstring gets closest match', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(candidate('abc', 'abcdef'));
  const result = sut.findSubstring(ut('xxxx abcd'), 2);
  expect(result).toHaveLength(1);
  expect(result[0].distance).toEqual(1);
});

test('TEST: findSimilarKeyword gets closest match', () => {
  const sut = new SimilarWordFinder<TestCandidate>(true);
  sut.addCandidate(candidate('abc', 'abcdef'));
  const result = sut.findIfOnlyWordsFromKeyword(ut('abcd'), 2);
  expect(result).toHaveLength(1);
  expect(result[0].distance).toEqual(1);
});
