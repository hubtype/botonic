import { stringifyWithRegexs, deserializeRegex } from '../src/utils'

describe('Regex serialization / deserialization', () => {
  const regexsItems = [
    { regex: /regex/i, string: '"/regex/i"', samples: ['Regex', 'regex'] },
    {
      regex: /another_regex/g,
      string: '"/another_regex/g"',
      samples: ['another_regex and another_regex'],
    },
  ]
  it('serializes json applying filter', () => {
    regexsItems.forEach(item => {
      const sut = stringifyWithRegexs(item.regex)
      expect(sut).toEqual(item.string)
    })
  })
  it('deserializes regexs correctly', () => {
    regexsItems.forEach(item => {
      const deserializedStringRegex = JSON.parse(item.string)
      const deserializedRegex = deserializeRegex(deserializedStringRegex)
      item.samples.forEach(sample => {
        const match = deserializedRegex.test(sample)
        expect(match).toBe(true)
      })
    })
  })
})
