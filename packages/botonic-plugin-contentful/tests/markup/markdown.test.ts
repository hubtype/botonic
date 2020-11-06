import { Markdown } from '../../src/markup'
import { createMarkUp } from '../../src/markup/factories'
import { MarkupType, TokenType } from '../../src/markup/markup'
import { testContentful } from '../contentful/contentful.helper'

describe('TEST markdown', () => {
  test('parse', () => {
    const sut = createMarkUp(MarkupType.GITHUB)

    const tokens = sut.parse('\\* **X Y**')

    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toEqual(TokenType.PARAGRAPH)
    const paragraph = tokens[0].tokens!

    expect(paragraph).toHaveLength(3)
    expect(paragraph[0]).toEqual({
      type: TokenType.ESCAPE,
      raw: '\\*',
      text: '*',
    })
    expect(paragraph[1]).toEqual({ type: TokenType.TEXT, raw: ' ', text: ' ' })
    expect(paragraph[2]).toEqual({
      type: TokenType.STRONG,
      raw: '**X Y**',
      text: 'X Y',
      tokens: [{ type: TokenType.TEXT, raw: 'X Y', text: 'X Y' }],
    })
  })

  test.each([
    ['#  **hi** *hi*', [TokenType.EMPHASIS], '#  **hi** hi'], // does not replace longer inlines
    ['#  *hi* **hi**', [TokenType.STRONG], '#  *hi* hi'], // does not replace shorter inlines
    ['* *hi*', [TokenType.EMPHASIS], '* hi'], // does not get confused with same tag on other blocks
  ])(
    'disableInlines (%s, %j) => %s',
    (input: string, inlineTypes: TokenType[], expected: string) => {
      const sut = new Markdown(MarkupType.GITHUB)

      const out = sut.disableInlines(input, inlineTypes)

      expect(out).toEqual(expected)
    }
  )

  test.each([
    ['hi', TokenType.EMPHASIS, '_hi_'],
    [' hi ', TokenType.EMPHASIS, '_hi_'],
    ['hi \\*', TokenType.STRONG, '**hi \\***'],
  ])(
    'wrapWithInline (%s, %s) => %s',
    (input: string, inlineType: TokenType, expected: string) => {
      const sut = createMarkUp(MarkupType.GITHUB)

      const out = sut.wrapWithInline(input, inlineType)

      expect(out).toEqual(expected)
    }
  )
})

describe('INTEGRATION TEST markdown from contentful.com editor toolbar', () => {
  const TEST_MARKDOWN_ID = '5slwsUzTzSsuPU5CXEytRr'
  const contentful = testContentful()
  const textFromContentful = async () =>
    (await contentful.text(TEST_MARKDOWN_ID)).text

  test('parse', async () => {
    const sut = createMarkUp(MarkupType.GITHUB)
    const tokens = sut.parse(await textFromContentful())

    expect(tokens[0].type).toEqual('heading')
    expect(tokens[1].type).toEqual('list')
    expect(tokens[2].type).toEqual('list')
    expect(tokens[3].type).toEqual('blockquote')

    const paragraph = tokens[4]
    expect(paragraph.type).toEqual('paragraph')
    expect(paragraph.tokens![0].type).toEqual('link')
    expect(paragraph.tokens![1].type).toEqual('text')
    expect(paragraph.tokens![2].type).toEqual('del')

    expect(tokens[5].type).toEqual('space')
    expect(tokens[6].type).toEqual('code')
    expect(tokens[7].type).toEqual('hr')
  })
})
