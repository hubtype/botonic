import type { BotContext } from '@botonic/core'
import {
  createTestBotContext,
  createTestSession,
  createTestSettings,
  TEST_DEFAULTS,
} from '@botonic/core/testing'
import { describe, expect, test } from '@jest/globals'

import { FlowLocale } from '../src/utils/flow-locale'

type FlowLocaleBotContextOptions = {
  /** When false, `LANGUAGE_DETECTION_ENABLED` is cleared so `!!value` is falsy in FlowLocale. */
  languageDetectionEnabled?: boolean
}

/**
 * Builds a BotContext using @botonic/core/testing factories. Overrides locale getters/setters so
 * `setSystemLocale` updates state (the stock `createTestBotContext` uses no-op setters).
 */
function createFlowLocaleBotContext(
  userLocale: string | undefined,
  systemLocale: string | undefined,
  options?: FlowLocaleBotContextOptions
): BotContext {
  const session = createTestSession({
    user: {
      locale:
        userLocale !== undefined ? userLocale : TEST_DEFAULTS.LOCALE,
      systemLocale:
        systemLocale !== undefined ? systemLocale : TEST_DEFAULTS.LOCALE,
    },
  })

  const user = session.user

  if (userLocale === undefined) {
    Object.assign(user, { locale: undefined })
  }
  if (systemLocale === undefined) {
    Object.assign(user, { system_locale: undefined })
  }

  let currentSystemLocale = user.system_locale as string | undefined

  const base = createTestBotContext({
    session,
    ...(options?.languageDetectionEnabled === false
      ? { settings: createTestSettings({ LANGUAGE_DETECTION_ENABLED: '' }) }
      : {}),
  })

  return {
    ...base,
    getUserLocale: () => user.locale as string | undefined,
    getSystemLocale: () => currentSystemLocale,
    setSystemLocale: (locale: string) => {
      currentSystemLocale = locale
      user.system_locale = locale
    },
  } as BotContext
}

describe('FlowLocale.resolve()', () => {
  describe('when user locale matches exactly', () => {
    test('should return the user locale when it matches a flow locale', () => {
      const botContext = createFlowLocaleBotContext('es', 'en')
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
      const botContext = createFlowLocaleBotContext('fr', 'en')
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
      const botContext = createFlowLocaleBotContext('es-ES', 'en')
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
      const botContext = createFlowLocaleBotContext('fr-CA', 'en')
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
      const botContext = createFlowLocaleBotContext('pt-BR', 'en')
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
    test('should return default locale when user locale does not match and is different from system locale', () => {
      const botContext = createFlowLocaleBotContext('de', 'es')
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

  describe('when falling back to default locale', () => {
    test('should return default locale when no match found', () => {
      const botContext = createFlowLocaleBotContext('de', 'it')
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
      const botContext = createFlowLocaleBotContext('de', 'it')
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
      const botContext = createFlowLocaleBotContext('de', 'it')
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
      const botContext = createFlowLocaleBotContext('es', 'en')
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
      const botContext = createFlowLocaleBotContext(undefined, 'es')
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

    test('should handle undefined system locale', () => {
      const botContext = createFlowLocaleBotContext('de', undefined)
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
      const botContext = createFlowLocaleBotContext('zh-Hans-CN', 'en')
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
      const botContext = createFlowLocaleBotContext('ES', 'EN')
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

  describe('when locales share language but differ in specificity', () => {
    test('should prefer system locale with region over generic user locale', () => {
      const botContext = createFlowLocaleBotContext('es', 'es-MX')
      const flowLocales = ['es', 'es-MX']
      const defaultLocaleCode = 'en'

      const result = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      ).resolve()

      expect(result).toBe('es-MX')
    })

    test('should fall back to generic locale when specific system locale not in flow', () => {
      const botContext = createFlowLocaleBotContext('es', 'es-MX')
      const flowLocales = ['es']
      const defaultLocaleCode = 'en'

      const result = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      ).resolve()

      expect(result).toBe('es')
    })

    test('should prefer user locale with region over generic system locale', () => {
      const botContext = createFlowLocaleBotContext('es-ES', 'es')
      const flowLocales = ['es-ES', 'es']
      const defaultLocaleCode = 'en'

      const result = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      ).resolve()

      expect(result).toBe('es-ES')
    })

    test('should use user locale when both have regions for the same language', () => {
      const botContext = createFlowLocaleBotContext('es-MX', 'es-CO')
      const flowLocales = ['es-MX', 'es-CO']
      const defaultLocaleCode = 'en'

      const result = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      ).resolve()

      expect(result).toBe('es-MX')
    })

    test('should not apply specificity logic when languages differ', () => {
      const botContext = createFlowLocaleBotContext('fr', 'es-MX')
      const flowLocales = ['fr', 'es-MX']
      const defaultLocaleCode = 'en'

      const result = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      ).resolve()

      expect(result).toBe('fr')
    })

    test('should set system locale to the more specific resolved locale', () => {
      const botContext = createFlowLocaleBotContext('es', 'es-MX')
      const flowLocales = ['es-MX']
      const defaultLocaleCode = 'en'

      new FlowLocale(botContext, flowLocales, defaultLocaleCode).resolve()

      expect(botContext.getSystemLocale()).toBe('es-MX')
    })
  })

  describe('priority order', () => {
    test('should prioritize user locale over system locale', () => {
      const botContext = createFlowLocaleBotContext('fr', 'es')
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

  describe('when LANGUAGE_DETECTION_ENABLED is falsy', () => {
    test('should resolve using system locale only, ignoring user vs system priority', () => {
      const botContext = createFlowLocaleBotContext('fr', 'es', {
        languageDetectionEnabled: false,
      })
      const flowLocales = ['en', 'es', 'fr']
      const defaultLocaleCode = 'en'

      const result = new FlowLocale(
        botContext,
        flowLocales,
        defaultLocaleCode
      ).resolve()

      expect(result).toBe('es')
    })

    test('should set system locale from flow match derived from current system locale', () => {
      const botContext = createFlowLocaleBotContext('es', 'fr', {
        languageDetectionEnabled: false,
      })
      const flowLocales = ['en', 'fr', 'de']
      const defaultLocaleCode = 'en'

      new FlowLocale(botContext, flowLocales, defaultLocaleCode).resolve()

      expect(botContext.getSystemLocale()).toBe('fr')
    })
  })
})
