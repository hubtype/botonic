/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

// eslint-disable-next-line filenames/match-regex
import {
  getCountryFromTimeZone,
  normalizeLocale,
  timeZoneToCountryCode,
} from '../../src/util/i18n'

describe('TEST: normalizeLocale - locale normalization', () => {
  describe('Standard locale formats with letter region codes (preserved)', () => {
    it.each([
      ['en-US', 'en-US'],
      ['es-ES', 'es-ES'],
      ['pt-BR', 'pt-BR'],
      ['fr-FR', 'fr-FR'],
      ['de-DE', 'de-DE'],
      ['ja-JP', 'ja-JP'],
      ['ko-KR', 'ko-KR'],
      ['en-GB', 'en-GB'],
      ['en-AU', 'en-AU'],
    ])('preserves letter region code: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('UN M.49 numeric region codes (stripped)', () => {
    it.each([
      ['es-419', 'es'], // Spanish - Latin America
      ['en-001', 'en'], // English - World
      ['en-150', 'en'], // English - Europe
      ['ar-001', 'ar'], // Arabic - World
      ['pt-015', 'pt'], // Portuguese - Northern Africa
    ])('strips numeric UN M.49 region code: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('Script subtags (language-Script or language-Script-COUNTRY)', () => {
    it.each([
      ['zh-Hans', 'zh'], // Chinese Simplified - no region
      ['zh-Hant', 'zh'], // Chinese Traditional - no region
      ['zh-Hans-CN', 'zh-CN'], // Chinese Simplified - China (letter region preserved)
      ['zh-Hant-TW', 'zh-TW'], // Chinese Traditional - Taiwan (letter region preserved)
      ['zh-Hant-HK', 'zh-HK'], // Chinese Traditional - Hong Kong (letter region preserved)
      ['sr-Latn', 'sr'], // Serbian - Latin script - no region
      ['sr-Cyrl', 'sr'], // Serbian - Cyrillic script - no region
      ['sr-Latn-RS', 'sr-RS'], // Serbian - Latin - Serbia (letter region preserved)
      ['az-Latn-AZ', 'az-AZ'], // Azerbaijani - Latin - Azerbaijan
      ['uz-Cyrl-UZ', 'uz-UZ'], // Uzbek - Cyrillic - Uzbekistan
    ])('handles script subtag, preserves letter region: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('Simple language codes (no region)', () => {
    it.each([
      ['en', 'en'],
      ['es', 'es'],
      ['pt', 'pt'],
      ['fr', 'fr'],
      ['de', 'de'],
      ['zh', 'zh'],
      ['ja', 'ja'],
      ['ar', 'ar'],
      ['hi', 'hi'],
      ['ru', 'ru'],
    ])('returns the same code when no region: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('Three-letter language codes (ISO 639-2/3)', () => {
    it.each([
      ['yue', 'yue'], // Cantonese - preserved as is
      ['cmn', 'zh'], // Mandarin Chinese - normalized to zh by Intl.Locale
      ['gsw', 'gsw'], // Swiss German - no ISO 639-1 equivalent
      ['nds', 'nds'], // Low German - no ISO 639-1 equivalent
      ['yue-HK', 'yue-HK'], // Cantonese - Hong Kong (letter region preserved)
    ])('handles three-letter language codes: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('Case insensitivity (normalized to lowercase language, uppercase region)', () => {
    it.each([
      ['EN-US', 'en-US'],
      ['en-us', 'en-US'],
      ['En-Us', 'en-US'],
      ['ES-419', 'es'], // Numeric region stripped
      ['ZH-HANS-CN', 'zh-CN'],
      ['en-gb', 'en-GB'],
    ])('normalizes case: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('Underscore separator (common in some systems)', () => {
    it.each([
      ['en_US', 'en-US'],
      ['es_ES', 'es-ES'],
      ['pt_BR', 'pt-BR'],
      ['zh_Hans_CN', 'zh-CN'],
      ['es_419', 'es'], // Numeric region stripped
    ])('handles underscore separator: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })

  describe('Edge cases and malformed input', () => {
    it('returns empty string for empty input', () => {
      expect(normalizeLocale('')).toBe('')
    })

    it('handles locale with extension subtags', () => {
      // BCP 47 extension subtags - region is preserved
      expect(normalizeLocale('en-US-u-ca-buddhist')).toBe('en-US')
      expect(normalizeLocale('ar-EG-u-nu-arab')).toBe('ar-EG')
    })

    it('handles private use subtags', () => {
      expect(normalizeLocale('en-x-custom')).toBe('en')
    })

    it('falls back for truly invalid locales', () => {
      // Invalid locale "invalid" is actually accepted by Intl.Locale as a language tag
      // so it parses and returns just the language part
      expect(normalizeLocale('invalid-locale-string')).toBe('invalid')
      // Single invalid word is returned as-is
      expect(normalizeLocale('xyz')).toBe('xyz')
    })
  })

  describe('Real-world browser navigator.language values', () => {
    it.each([
      ['en-GB', 'en-GB'], // British English
      ['en-AU', 'en-AU'], // Australian English
      ['es-MX', 'es-MX'], // Mexican Spanish
      ['es-AR', 'es-AR'], // Argentine Spanish
      ['fr-CA', 'fr-CA'], // Canadian French
      ['pt-PT', 'pt-PT'], // European Portuguese
      ['zh-CN', 'zh-CN'], // Simplified Chinese (China)
      ['zh-TW', 'zh-TW'], // Traditional Chinese (Taiwan)
      ['nb-NO', 'nb-NO'], // Norwegian Bokmål
      ['nn-NO', 'nn-NO'], // Norwegian Nynorsk
      ['ca-ES', 'ca-ES'], // Catalan
      ['eu-ES', 'eu-ES'], // Basque
      ['gl-ES', 'gl-ES'], // Galician
    ])('preserves real browser locale with letter region: "%s" -> "%s"', (locale, expected) => {
      expect(normalizeLocale(locale)).toBe(expected)
    })
  })
})

describe('TEST: timeZoneToCountryCode - timezone to country mapping', () => {
  describe('Maps common time zones to correct country codes', () => {
    it.each([
      ['Europe/Madrid', 'ES'],
      ['Europe/London', 'GB'],
      ['Europe/Paris', 'FR'],
      ['Europe/Berlin', 'DE'],
      ['Europe/Rome', 'IT'],
      ['America/New_York', 'US'],
      ['America/Los_Angeles', 'US'],
      ['America/Chicago', 'US'],
      ['America/Mexico_City', 'MX'],
      ['America/Sao_Paulo', 'BR'],
      ['America/Argentina/Buenos_Aires', 'AR'],
      ['Asia/Tokyo', 'JP'],
      ['Asia/Shanghai', 'CN'],
      ['Asia/Hong_Kong', 'HK'],
      ['Asia/Singapore', 'SG'],
      ['Asia/Seoul', 'KR'],
      ['Asia/Kolkata', 'IN'],
      ['Australia/Sydney', 'AU'],
      ['Pacific/Auckland', 'NZ'],
    ])('maps "%s" -> "%s"', (timeZone, expected) => {
      expect(timeZoneToCountryCode[timeZone]).toBe(expected)
    })
  })

  describe('African time zones', () => {
    it.each([
      ['Africa/Cairo', 'EG'],
      ['Africa/Johannesburg', 'ZA'],
      ['Africa/Lagos', 'NG'],
      ['Africa/Nairobi', 'KE'],
      ['Africa/Casablanca', 'MA'],
    ])('maps "%s" -> "%s"', (timeZone, expected) => {
      expect(timeZoneToCountryCode[timeZone]).toBe(expected)
    })
  })

  it('returns undefined for unknown time zones', () => {
    expect(timeZoneToCountryCode['Unknown/TimeZone']).toBeUndefined()
    expect(timeZoneToCountryCode.Invalid).toBeUndefined()
  })
})

describe('TEST: getCountryFromTimeZone - helper function', () => {
  it('returns country code for valid time zone', () => {
    expect(getCountryFromTimeZone('Europe/Madrid')).toBe('ES')
    expect(getCountryFromTimeZone('America/New_York')).toBe('US')
    expect(getCountryFromTimeZone('Asia/Tokyo')).toBe('JP')
  })

  it('returns undefined for unknown time zone', () => {
    expect(getCountryFromTimeZone('Unknown/TimeZone')).toBeUndefined()
  })

  it('uses browser time zone when no argument provided', () => {
    // This test verifies the function can be called without arguments
    // The actual result depends on the test environment's time zone
    const result = getCountryFromTimeZone()
    // Result should be either a valid country code or undefined
    expect(result === undefined || typeof result === 'string').toBe(true)
  })
})
