import { tokenizerPerLocale } from '../../../src/nlp'
import { StemmerHr } from '../../../src/nlp/stemmers/stemmer-hr'

test.each<any>([
  ['pisanje', ['pisanj']],
  ['razgovarajući', ['razgovarajuc']],
  ['hodanje', ['hodanj']],
  ['pješački', ['pjesack']],
  ['Kartografija', ['kartografij']],
  ['Matematika', ['matematik']],
  ['Potrebno', ['potrebn']],
  ['Najbolje', ['najbolj']],
  ['najbolji', ['najbolj']],
  ['prevariti', ['prevari']],
  ['Slušajte', ['slusa']],
  ['pjevati', ['pjeva']],
  ['strofe', ['strof']],
  ['ostavka', ['ostavk']],
  ['pjesma', ['pjesm']],
  ['tablica', ['tablic']],
  ['bombon', ['bombon']],
  ['poljoprivrednik', ['poljoprivrednik']],
  ['sretno', ['sretn']],
  ['roditeljski', ['roditeljsk']],
])('TEST: Croatian stemmer("%s")->"%s"', (word: string, expected: string) => {
  const tokenizer = tokenizerPerLocale('hr')
  const sut = new StemmerHr()
  const result = sut.stem(tokenizer.tokenize(word, true))
  expect(result).toEqual(expected)
})
