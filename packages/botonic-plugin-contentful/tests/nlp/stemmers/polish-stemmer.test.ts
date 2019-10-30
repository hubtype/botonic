import { PolishStemmer } from '../../../src/nlp/stemmers/polish-stemmer'
import { tokenizerPerLocale } from '../../../src/nlp'

test('hack because webstorm does not recognize test.each', () => {})

test.each<any>([
  ['Organizacji', 'organiz'],
  ['organizacja', 'organiz'],
  ['Sytuacja', 'sytu'],
  ['JeŚć', 'je'],
  ['Jesc', 'je'],
  ['Mało', 'mało'],
  ['Malo', 'malo'],
  ['Kartografia', 'kartograf'],
  ['Matematyka', 'matemat'],
  ['Konieczny', 'konie'],
  ['Najlepszy', 'lep'],
  ['najlepszych', 'lep'],
  ['zwieść', 'zwi'],
  ['Słuchaj', 'słuch'],
  ['śpiewać', 'śpiew'],
  ['zwrotkach', 'zwrotk'],
  ['rezygnacji', 'rezygn'],
  ['piosence', 'piosen'],
  ['stoliczek', 'stol'],
  ['cukierek', 'cukier'],
  ['parobek', 'parob'],
  ['byłbym', 'był'],
  ['szczęśliwie', 'szczęśliw'],
  ['niedobrze', 'niedobr'],
  ['rodzicielskiej', 'rodzicielski'],
  ['warunków', 'warunk'],
  ['rodzicami', 'rodz'],
  ['odnowy', 'odn'],
  ['negacja', 'neg'],
])('TEST: Polish stemmer("%s")->"%s"', (word: string, expected: string) => {
  const tokenizer = tokenizerPerLocale('pl')
  const sut = new PolishStemmer(tokenizer)
  const result = sut.tokenizeAndStem(word, true)
  expect(result).toEqual([expected])
})
