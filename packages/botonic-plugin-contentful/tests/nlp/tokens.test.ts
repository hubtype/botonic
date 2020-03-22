import { TokenizerCa } from '../../src/nlp'

describe('TokenizerCa', () => {
  test.each([
    ['adonar-nos', ['adonar', 'nos']],
    ['adonar-se', ['adonar', 'se']],
    ["adonar-se'n", ['adonar', 'se', 'n']],
    ['donar-li', ['donar', 'li']],
    ['covid-19', ['covid-19']],
    ['covid19', ['covid19']],
    ['f/15', ['f/15']],
  ])(
    'TEST: TokenizerCa splits - and /',
    (raw: string, expectedTokens: string[]) => {
      expect(raw.split(TokenizerCa.SPLIT_REGEX)).toEqual(expectedTokens)
    }
  )
})
