import type { BotContext } from '@botonic/core'

export class FlowLocale {
  constructor(
    private readonly botContext: BotContext,
    private readonly flowLocales: string[],
    private readonly defaultLocaleCode: string
  ) {}

  resolve(): string {
    const priorityLocale = this.isLanguageDetectionEnabled()
      ? this.getPriorityLocale()
      : this.botContext.getSystemLocale()

    if (priorityLocale) {
      const exactMatch = this.matchExactLocale(priorityLocale)
      if (exactMatch) {
        return this.applyLocale(exactMatch)
      }

      const languageMatch = this.matchLanguage(priorityLocale)
      if (languageMatch) {
        return this.applyLocale(languageMatch)
      }
    }

    return this.applyLocale(this.getDefaultLocale())
  }

  private isLanguageDetectionEnabled(): boolean {
    return !!this.botContext.settings.LANGUAGE_DETECTION_ENABLED
  }

  /**
   * Rules:
   * - If user and system languages differ, user locale takes priority.
   * - If both share the same language, the more specific locale wins.
   * - If both have the same specificity, user locale wins.
   */
  private getPriorityLocale(): string | undefined {
    const userLocale = this.botContext.getUserLocale()
    const systemLocale = this.botContext.getSystemLocale()

    if (!userLocale || !systemLocale) {
      return undefined
    }

    const userLanguage = this.getLanguage(userLocale)
    const systemLanguage = this.getLanguage(systemLocale)

    if (userLanguage !== systemLanguage) {
      return userLocale
    }
    const userIsSpecific = this.isSpecificLocale(userLocale)
    const systemIsSpecific = this.isSpecificLocale(systemLocale)

    if (userIsSpecific && !systemIsSpecific) {
      return userLocale
    }
    if (!userIsSpecific && systemIsSpecific) {
      return systemLocale
    }

    return userLocale
  }

  private matchExactLocale(locale: string): string | undefined {
    return this.flowLocales.includes(locale) ? locale : undefined
  }

  private matchLanguage(locale: string): string | undefined {
    const language = this.getLanguage(locale)
    return this.flowLocales.includes(language) ? language : undefined
  }

  private getDefaultLocale(): string {
    return this.defaultLocaleCode || 'en'
  }

  private applyLocale(locale: string): string {
    this.botContext.setSystemLocale(locale)
    this.botContext.session.user.system_locale_updated = true
    return locale
  }

  private getLanguage(locale: string): string {
    return locale.split('-')[0]
  }

  private isSpecificLocale(locale: string): boolean {
    return locale.includes('-')
  }
}
