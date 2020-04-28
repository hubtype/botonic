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

  renderToken(token: Token): string {
    throw new Error('Not implemented')
    // if (token.items) {
    //   return this.render(token.items, '\n')
    // }
    // if (token.tokens && token.tokens.length > 1) {
    //   return this.render(token.tokens, '')
    // }
    // return token.raw || token.text || ''
  }
  wrapWithInline(input: string, inlineType: TokenType): string {
    if (inlineType === TokenType.EMPHASIS) {
      return `_${input}_`
    }
    if (inlineType === TokenType.STRONG) {
      return `**${input}**`
    }
    throw new Error(`wrapWithInline does not support inline ${inlineType}`)
  }
}

// /**
//  * Converts markdown from contentful flavour to whatsapp one
//  */
// export function contentfulToWhatsApp(txt: string): string {
//   return txt.replace(
//     new RegExp(CONTENTFUL_MARKDOWN.BOLD, 'g'),
//     WHATSAPP_MARKDOWN.BOLD
//   )
// }

// /**
//  * Returns the chunks of text highlighted as bold
//  * TODO find both markdown bold syntaxes
//  */
// export function oldFindContentfulBold(txt: string): string[] {
//   const mark = `\\${WHATSAPP_MARKDOWN.BOLD}`
//   let matches = txt.match(new RegExp(`${mark}.*${mark}`))
//   if (!matches) {
//     const mark = CONTENTFUL_MARKDOWN.BOLD
//     matches = txt.match(new RegExp(`${mark}.*${mark}`))
//     if (!matches) {
//       return []
//     }
//   }
//   const len = (txt: string) => {
//     for (const sep of [WHATSAPP_MARKDOWN.BOLD, CONTENTFUL_MARKDOWN.BOLD]) {
//       if (txt.startsWith(sep)) {
//         return sep.length
//       }
//     }
//     return 0
//   }
//
//   return matches.map(m => {
//     const length = len(m)
//     return m.substr(length, m.length - 2 * length)
//   })
// }
