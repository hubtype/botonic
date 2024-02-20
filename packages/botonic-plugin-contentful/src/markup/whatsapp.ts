import { MarkUp, MarkupType, Token, TokenType } from './markup'

export class WhatsApp extends MarkUp {
  type = MarkupType.WHATSAPP
  STRONG = '*'
  EMPHASIS = '_'
  constructor() {
    super(MarkupType.WHATSAPP)
  }

  parse(_txt: string): Token[] {
    throw new Error('WhatsApp.parse not implemented')
  }

  renderToken(token: Token): string {
    if (token.items) {
      return token.items.map(item => this.render(item.tokens!)).join('\n')
    }
    const inner = token.tokens
      ? this.render(token.tokens, '')
      : token.text || ''
    if (token.type == TokenType.STRONG) {
      return `${this.STRONG}${inner}${this.STRONG}`
    }
    if (token.type == TokenType.EMPHASIS) {
      return `${this.EMPHASIS}${inner}${this.EMPHASIS}`
    }
    return inner || ''
  }

  wrapWithInline(input: string, inlineType: TokenType): string {
    if (inlineType === TokenType.EMPHASIS) {
      return `_${input}_`
    }
    if (inlineType === TokenType.STRONG) {
      return `*${input}*`
    }
    throw new Error(`wrapWithInline does not support inline ${inlineType}`)
  }
}
