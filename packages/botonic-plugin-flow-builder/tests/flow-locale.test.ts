import type { BotContext } from '@botonic/core'
import { describe, expect, test } from '@jest/globals'

import { FlowLocale } from '../src/utils/flow-locale'

function createMockBotContext(
  userLocale: string,
  systemLocale: string
): BotContext {
  let currentSystemLocale = systemLocale

  return {
    session: {
      user: {
        locale: userLocale,
        system_locale: systemLocale,
      },
    },
    getSystemLocale: () => currentSystemLocale,
    setSystemLocale: (locale: string) => {
      currentSystemLocale = locale
    },
  } as unknown as BotContext
}

describe('FlowLocale.resolve()', () => {
  describe('when user locale matches exactly', () => {
    test('should return the user locale when it matches a flow locale', () => {
      const botContext = createMockBotContext('es', 'en')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('es')
    })

    test('should set system locale when user locale is resolved', () => {
      const botContext = createMockBotContext('fr', 'en')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      flowLocale.resolve()

      expect(botContext.getSystemLocale()).toBe('fr')
    })
  })

  describe('when user locale has language-region format', () => {
    test('should resolve to language code when exact locale not found but language is available', () => {
      const botContext = createMockBotContext('es-ES', 'en')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('es')
    })

    test('should set system locale to resolved language', () => {
      const botContext = createMockBotContext('fr-CA', 'en')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      flowLocale.resolve()

      expect(botContext.getSystemLocale()).toBe('fr')
    })

    test('should prefer exact match over language extraction', () => {
      const botContext = createMockBotContext('pt-BR', 'en')
      const flowLocales = ['en', 'pt-BR', 'pt']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('pt-BR')
    })
  })

  describe('when system locale matches', () => {
    test('should return system locale when user locale does not match', () => {
      const botContext = createMockBotContext('de', 'es')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('es')
    })

    test('should resolve system locale as language when exact match not found', () => {
      const botContext = createMockBotContext('de', 'fr-FR')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('fr')
    })

    test('should update system locale when resolved as language', () => {
      const botContext = createMockBotContext('de', 'es-MX')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      flowLocale.resolve()

      expect(botContext.getSystemLocale()).toBe('es')
    })
  })

  describe('when falling back to default locale', () => {
    test('should return default locale when no match found', () => {
      const botContext = createMockBotContext('de', 'it')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('en')
    })

    test('should set system locale to default when falling back', () => {
      const botContext = createMockBotContext('de', 'it')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'fr'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      flowLocale.resolve()

      expect(botContext.getSystemLocale()).toBe('fr')
    })

    test('should return "en" when default locale code is empty', () => {
      const botContext = createMockBotContext('de', 'it')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = ''

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('en')
    })
  })

  describe('edge cases', () => {
    test('should handle empty flow locales array', () => {
      const botContext = createMockBotContext('es', 'en')
      const flowLocales: string[] = []
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('en')
    })

    test('should handle undefined user locale', () => {
      const botContext = createMockBotContext(
        undefined as unknown as string,
        'es'
      )
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('es')
    })

    test('should handle undefined system locale', () => {
      const botContext = createMockBotContext(
        'de',
        undefined as unknown as string
      )
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'fr'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('fr')
    })

    test('should handle locale with multiple dashes', () => {
      const botContext = createMockBotContext('zh-Hans-CN', 'en')
      const flowLocales = ['en', 'zh']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('zh')
    })

    test('should be case sensitive when matching locales', () => {
      const botContext = createMockBotContext('ES', 'EN')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('en')
    })
  })

  describe('priority order', () => {
    test('should prioritize user locale over system locale', () => {
      const botContext = createMockBotContext('fr', 'es')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('fr')
    })

    test('should prioritize system locale over default', () => {
      const botContext = createMockBotContext('de', 'fr')
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const flowLocale = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      )

      const result = flowLocale.resolve()

      expect(result).toBe('fr')
    })
  })
})
