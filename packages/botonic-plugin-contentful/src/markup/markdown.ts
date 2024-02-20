import * as marked from 'marked'

import { MarkUp, MarkupType, Token, TokenType } from './markup'

/**
 * marked's intex.ts does not include these types (though they work): del, strong, em
 */
export class Markdown extends MarkUp {
  // https://marked.js.org/#/README.md#specifications
  options: marked.MarkedOptions

  constructor(flavour: MarkupType) {
    super(flavour)
    switch (flavour) {
      case MarkupType.MARKDOWN:
        this.options = {}
        break
      case MarkupType.GITHUB:
      case MarkupType.CONTENTFUL:
        this.options = { gfm: true }
        break
      default:
        throw Error(`Invalid markdown flavour: ${flavour}`)
    }
  }

  parse(txt: string): Token[] {
    // cannot cache Lexer because it would accumulate the tokens
    return marked.lexer(txt) as Token[]
  }

  renderToken(_token: Token): string {
    throw new Error('Not implemented')
  }

  wrapWithInline(input: string, inlineType: TokenType): string {
    // emphasis & strong cannot have internal spaces
    input = input.trim()
    if (inlineType === TokenType.EMPHASIS) {
      return `_${input}_`
    }
    if (inlineType === TokenType.STRONG) {
      return `**${input}**`
    }
    throw new Error(`wrapWithInline does not support inline ${inlineType}`)
  }
}
