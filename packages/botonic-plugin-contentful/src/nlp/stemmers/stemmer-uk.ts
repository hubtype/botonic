import Stemmer from '@nlpjs/core/src/stemmer'
// Replaced the orginal lookbehind regex because they were not supported by Safari

export class StemmerUk implements Stemmer {
  public stem(tokens: string[]): string[] {
    return tokens.map(token => this.stemToken(token))
  }

  private stemToken(token: string): string {
    const vowelMatch = /[аеиоуюяіїє]/.exec(token)
    if (!vowelMatch) {
      return token
    } else if (vowelMatch.index != undefined) {
      const start = token.slice(0, vowelMatch.index + 1)
      token = token.slice(vowelMatch.index + 1)

      if (token === '') {
        return start
      }

      token = this.step1(token)
      token = this.step2(token)
      token = this.step3(token)
      token = this.step4(token)

      return `${start}${token}`
    } else {
      return token
    }
  }

  private replace(token: string, regex: RegExp, replacement = ''): string {
    return token.replace(regex, replacement)
  }

  private step1(token: string): string {
    let originalToken = token
    token = this.replace(token, /(?:[иы]в(?:ши(?:сь)?)?)$/)
    token = this.replace(token, /(?:а(?:в(?:ши(?:сь)?)?))$/, 'а')
    token = this.replace(token, /(?:я(?:в(?:ши(?:сь)?)?))$/, 'я')
    if (originalToken === token) {
      token = this.replace(token, /с[яьи]$/)
      originalToken = token
      token = this.replace(
        token,
        /(?:[аеєуюя]|еє|ем|єє|ий|их|іх|ів|ій|ім|їй|ім|им|ими|іми|йми|ої|ою|ова|ове|ого|ому)$/
      )
      if (originalToken !== token) {
        token = this.replace(token, /(?:[аіу]|ій|ий|им|ім|их|йми|ого|ому|ою)$/)
      } else {
        originalToken = token
        token = this.replace(
          token,
          /(?:[еєую]|ав|али|ати|вши|ив|ити|ме|сь|ся|ши|учи|яти|ячи|ать|ять)$/g
        )
        if (originalToken === token) {
          token = this.replace(
            token,
            /(?:[аеєіїийоуыьюя]|ам|ах|ами|ев|еві|еи|ей|ем|ею|єм|єю|ів|їв|ий|ием|ию|ия|иям|иях|ов|ові|ой|ом|ою|ью|ья|ям|ями|ях)$/g
          )
        }
      }
    }
    return token
  }

  private step2(token: string): string {
    return this.replace(token, /и$/)
  }

  private step3(token: string): string {
    if (
      /[^аеиоуюяіїє][аеиоуюяіїє]+[^аеиоуюяіїє]+[аеиоуюяіїє].*oсть/g.exec(token)
    ) {
      token = this.replace(token, /ость$/)
    }
    return token
  }

  private step4(token: string): string {
    const originalToken = token
    token = this.replace(originalToken, /ь$/)
    if (originalToken === token) {
      token = this.replace(token, /ейше$/)
      token = this.replace(token, /нн$/, 'н')
    }
    return token
  }
}
