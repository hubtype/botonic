import escapeStringRegexp from 'escape-string-regexp'

export enum MarkupType {
  /**
   * CommonMark markdown
   * https://spec.commonmark.org/
   * Italics is *text* or _text_
   * Bold is **text** or __text__
   * */
  MARKDOWN = 'markdown',

  /**
   * Bold is *text* and italics is _text_
   * https://faq.whatsapp.com/en/android/26000002/
   **/
  WHATSAPP = 'whatsapp',

  /**
   * https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf
   * https://guides.github.com/features/mastering-markdown/
   */
  GITHUB = 'github',

  /**
   * Contentful supports github flavoured markdown. Its editor by default generates:
   * Italics with *text*
   * Bold with __text__
   */
  CONTENTFUL = 'contentful',
}

export enum TokenType {
  STRONG = 'strong', // bold
  EMPHASIS = 'em', // italics
  ESCAPE = 'escape', // escape special chars
  PARAGRAPH = 'paragraph',
  TEXT = 'text',
  SPACE = 'space',
  CODE = 'code',
  HEADING = 'heading',
  // TODO add others
}

export interface Token {
  type:
    | TokenType
    | TokenType.STRONG
    | TokenType.EMPHASIS
    | TokenType.PARAGRAPH // if TokenType.PARAGRAPH or TEXT is used, typescript complains when converting marked tokens
    | TokenType.TEXT
    | TokenType.SPACE
    | TokenType.CODE
    | TokenType.HEADING
  // | 'table'
  // | 'hr'
  // | 'blockquote_start'
  // | 'blockquote_end'
  // | 'list_start'
  // | 'loose_item_start'
  // | 'list_item_start'
  // | 'list_item_end'
  // | 'list_end'
  // | 'html'
  // | 'del'
  raw?: string
  text?: string
  tokens?: Token[]
  items?: Token[]
}

export abstract class MarkUp {
  protected constructor(readonly type: MarkupType) {}

  abstract parse(txt: string): Token[]

  render(tokens: Token[], separator = '\n'): string {
    return tokens.map(t => this.renderToken(t)).join(separator)
    // let render = ''
    // visitTokens(tokens, t => render += this.renderToken())
  }

  protected abstract renderToken(token: Token): string

  /** Remove an inline content (https://spec.commonmark.org/0.29/#inlines)
   * eg.  disableInlines('_hi_', EMPHASIS) = 'hi' */
  disableInlines(input: string, inlineTypes: TokenType[]): string {
    // Ideally we should be able to modify the token tree and re-render, but I didn't
    // find any js library able to render markdown (they always render html)
    const tokens = this.parse(input)
    const bolds = recursiveTokenFind(tokens, t => inlineTypes.includes(t.type))
    for (const bold of bolds) {
      const MARKER = escapeStringRegexp(bold.raw![0])
      const regex = new RegExp(
        `(?<!${MARKER})${escapeStringRegexp(bold.raw!)}(?!${MARKER})`
      )
      input = input.replace(regex, bold.tokens![0].text!)
    }
    return input
  }

  abstract wrapWithInline(input: string, inlineType: TokenType): string
}

export function visitTokens(input: Token[], visitor: (t: Token) => void): void {
  for (const token of input) {
    if (token.items) {
      token.items.forEach(t => visitTokens(t.tokens!, visitor))
    } else if (token.tokens) {
      visitTokens(token.tokens, visitor)
    }
    visitor(token)
  }
}

export function recursiveTokenFind(
  tokens: Token[],
  predicate: (t: Token) => boolean
): Token[] {
  const out: Token[] = []
  visitTokens(tokens, (t: Token) => {
    if (predicate(t)) out.push(t)
  })
  return out
}
