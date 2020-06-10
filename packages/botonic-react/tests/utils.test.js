import { serializeRegexs, rehydrateRegex } from '../src/utils'

describe('Regex serialization / rehydration', () => {
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
      const sut = JSON.stringify(item.regex, serializeRegexs)
      expect(sut).toEqual(item.string)
    })
  })
  it('rehydrates regexs correctly', () => {
    regexsItems.forEach(item => {
      const rehydratedStringRegex = JSON.parse(item.string)
      const rehydratedRegex = rehydrateRegex(rehydratedStringRegex)
      item.samples.forEach(sample => {
        const match = rehydratedRegex.test(sample)
        expect(match).toBe(true)
      })
    })
  })
})
