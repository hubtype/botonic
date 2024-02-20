import {
  MarkupType,
  recursiveTokenFind,
  Token,
  TokenType,
  visitTokens,
} from '../../src/markup'
import { createMarkUp } from '../../src/markup/factories'

describe('TEST MarkUp methods', () => {
  test('multiple parsings on a single Markdown instance parsing', () => {
    const parser = createMarkUp(MarkupType.MARKDOWN)
    expect(parser.parse('hi').map(t => t.text)).toEqual(['hi'])
    expect(parser.parse('bye').map(t => t.text)).toEqual(['bye'])
  })

  test.each<any>([['a __kk__ 3', ['a ', 'kk', '__kk__', ' 3', 'a __kk__ 3']]])(
    'visitTokens(strong)(%s)=%',
    (txt: string, expected: Token[]) => {
      const parser = createMarkUp(MarkupType.MARKDOWN)
      const tokens = parser.parse(txt)

      const found: Token[] = []
      visitTokens(tokens, t => found.push(t))
      expect(found.map(t => t.raw)).toEqual(expected)
    }
  )

  test.each<any>([
    ['kk', []],
    ['* kk', []], // a list
    ['escaped \\*', []],
    ['a __kkk__ 3', ['kkk']], // middle of sentence
    ['**q q** 3 **p**', ['q q', 'p']], // start and end of sentece
  ])('findTokensOfType(strong)(%s)=%', (txt: string, expected: Token[]) => {
    const parser = createMarkUp(MarkupType.MARKDOWN)
    const tokens = parser.parse(txt)

    const found = recursiveTokenFind(tokens, t => t.type == TokenType.STRONG)
    expect(found.map(t => t.text)).toEqual(expected)
  })
})
