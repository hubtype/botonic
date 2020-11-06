//TODO convert to a unit test
// test('TEST: SimilarWordFinder performance', () => {
import { SimilarWordFinder } from '../nlp/similar-words'
import {
  CandidateWithKeywords,
  Keyword,
  MatchType,
  NormalizedUtterance,
  Word,
} from '../nlp'

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
function ut(text: string): NormalizedUtterance {
  return new NormalizedUtterance(
    text,
    text.split(' ').map(w => new Word(w, w))
  )
}

function perform() {
  const sut = new SimilarWordFinder<TestCandidate>(true)
  for (let i = 0; i < 50; i++) {
    sut.addCandidate(candidate([`kw${i}`]))
  }
  let utterance = ''
  for (let i = 0; i < 130; i++) {
    utterance += String(i) + ' '
  }
  console.log(utterance.length)
  console.log(new Date())
  sut.find(MatchType.KEYWORDS_AND_OTHERS_FOUND, ut(utterance), 1)
  console.log(new Date())
}

perform()
