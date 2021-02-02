import { tokenizerPerLocale } from '../../../src/nlp'
import { StemmerUk } from '../../../src/nlp/stemmers/stemmer-uk'

test.each<any>([
  ['розмовляючи', ['розмовляюч']],
  ['говорити', ['говор']],
  ['парковка', ['парковк']],
  ['експеримент', ['експеримент']],
  ['зустрічі', ['зустріч']],
  ['потурбувавши', ['потурбува']], //Solved without lookbehind regex
])('TEST: Ukrainian stemmer("%s")->"%s"', (word: string, expected: string) => {
  const tokenizer = tokenizerPerLocale('hr')
  const sut = new StemmerUk()
  const result = sut.stem(tokenizer.tokenize(word, false))
  expect(result).toEqual(expected)
})
