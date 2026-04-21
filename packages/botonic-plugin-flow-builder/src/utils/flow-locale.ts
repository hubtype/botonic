import type { BotContext } from '@botonic/core'

export class FlowLocale {
  constructor(
    private botContext: BotContext,
    private flowLocales: string[],
    private defaultLocaleCode: string
  ) {}

  resolve(): string {
    const userLocale = this.botContext.getUserLocale()
    const systemLocale = this.botContext.getSystemLocale()

    const moreSpecificLocale = this.selectMoreSpecificLocale(
      userLocale,
      systemLocale
    )

    if (moreSpecificLocale) {
      const resolvedSpecific = this.resolveAsLocale(moreSpecificLocale)
      if (resolvedSpecific) {
        this.setSystemLocale(resolvedSpecific)
        return resolvedSpecific
      }

      const resolvedSpecificLanguage =
        this.resolveAsLanguage(moreSpecificLocale)
      if (resolvedSpecificLanguage) {
        this.setSystemLocale(resolvedSpecificLanguage)
        return resolvedSpecificLanguage
      }
    }

    const defaultLocale = this.resolveAsDefaultLocale()
    this.setSystemLocale(defaultLocale)
    return defaultLocale
  }

  private selectMoreSpecificLocale(
    userLocale: string,
    systemLocale: string
  ): string | undefined {
    if (!userLocale || !systemLocale) {
      return undefined
    }

    const languageUser = userLocale.split('-')[0]
    const languageSystem = systemLocale.split('-')[0]

    if (languageUser !== languageSystem) {
      return userLocale
    }

    const hasRegionUserLocale = userLocale.includes('-')
    const hasRegionSystemLocale = systemLocale.includes('-')

    if (hasRegionUserLocale === hasRegionSystemLocale) {
      return userLocale
    }

    return hasRegionUserLocale ? userLocale : systemLocale
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
      return language
    }
    return undefined
  }

  private resolveAsDefaultLocale(): string {
    return this.defaultLocaleCode || 'en'
  }

  private setSystemLocale(locale: string): void {
    this.botContext.setSystemLocale(locale)
    this.botContext.session.user.system_locale_updated = true
  }
}
