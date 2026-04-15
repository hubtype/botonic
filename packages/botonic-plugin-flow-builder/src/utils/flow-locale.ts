import type { BotContext } from '@botonic/core'

export class FlowLocale {
  constructor(
    private botContext: BotContext,
    private flowLocales: string[],
    private defaultLocaleCode: string
  ) {}

  resolve(): string {
    const resolvedUserLocale = this.resolveAsUserLocale()
    if (resolvedUserLocale) {
      return resolvedUserLocale
    }

    const resolvedSystemLocale = this.resolveAsSystemLocale()
    if (resolvedSystemLocale) {
      return resolvedSystemLocale
    }

    const defaultLocale = this.resolveAsDefaultLocale()
    this.setSystemLocale(defaultLocale)
    return defaultLocale
  }

  private resolveAsUserLocale(): string | undefined {
    const userLocale = this.botContext.session.user.locale

    const resolvedUserLocale = this.resolveAsLocale(userLocale)
    if (resolvedUserLocale) {
      this.setSystemLocale(resolvedUserLocale)
      return resolvedUserLocale
    }

    const resolvedUserLanguage = this.resolveAsLanguage(userLocale)
    if (resolvedUserLanguage) {
      this.setSystemLocale(resolvedUserLanguage)
      return resolvedUserLanguage
    }

    return undefined
  }

  private resolveAsSystemLocale(): string | undefined {
    const systemLocale = this.botContext.getSystemLocale()

    const locale = this.resolveAsLocale(systemLocale)
    if (locale) {
      return locale
    }

    const language = this.resolveAsLanguage(systemLocale)
    if (language) {
      this.setSystemLocale(language)
      return language
    }
    return undefined
  }

  private resolveAsLocale(locale: string): string | undefined {
    if (this.flowLocales.find(flowLocale => flowLocale === locale)) {
      return locale
    }
    return undefined
  }

  private resolveAsLanguage(locale?: string): string | undefined {
    const language = locale?.split('-')[0]
    if (
      language &&
      this.flowLocales.find(flowLocale => flowLocale === language)
    ) {
      // console.log(`locale: ${locale} has been resolved as ${language}`)
      return language
    }
    return undefined
  }

  private resolveAsDefaultLocale(): string {
    // console.log(`Resolve locale with default locale: ${this.defaultLocaleCode}`)
    return this.defaultLocaleCode || 'en'
  }

  private setSystemLocale(locale: string): void {
    this.botContext.setSystemLocale(locale)
    this.botContext.session.user.system_locale_updated = true
  }
}
