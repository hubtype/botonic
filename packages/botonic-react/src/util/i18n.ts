/* eslint-disable filenames/match-regex */
/**
 * Normalizes a locale string to a valid format.
 * Keeps letter-based region codes (e.g., 'en-GB', 'es-ES') but strips
 * numeric UN M.49 region codes (e.g., 'es-419' -> 'es').
 * Handles both dash and underscore separators.
 * @example
 * normalizeLocale('en-GB') // 'en-GB' (letter region preserved)
 * normalizeLocale('es-419') // 'es' (numeric region stripped)
 * normalizeLocale('zh-Hans-CN') // 'zh-CN' (script stripped, letter region preserved)
 * normalizeLocale('en_US') // 'en-US' (underscore normalized)
 */
export function normalizeLocale(locale = navigator.language) {
  // Normalize underscore separators to dashes (some systems use underscores)
  const normalizedLocale = locale.replace(/_/g, '-')
  try {
    const parsed = new Intl.Locale(normalizedLocale)
    const language = parsed.language
    const region = parsed.region

    // If no region, return just the language
    if (!region) {
      return language
    }

    // If region is numeric (UN M.49 code like '419'), return just the language
    if (/^\d+$/.test(region)) {
      return language
    }

    // Otherwise, return language-REGION (letter-based region codes)
    return `${language}-${region}`
  } catch {
    // Fallback: check if the part after dash is numeric
    const parts = normalizedLocale.split('-')
    if (parts.length > 1 && /^\d+$/.test(parts[1])) {
      return parts[0]
    }
    return normalizedLocale
  }
}

/**
 * Gets the country code from a time zone string.
 * @param timeZone - IANA time zone string (e.g., 'Europe/Madrid')
 * @returns ISO 3166-1 alpha-2 country code (e.g., 'ES') or undefined if not found
 * @example
 * getCountryFromTimeZone('Europe/Madrid') // 'ES'
 * getCountryFromTimeZone('America/New_York') // 'US'
 */
export function getCountryFromTimeZone(
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): string | undefined {
  return timeZoneToCountryCode[timeZone]
}

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Mapping of IANA time zones to ISO 3166-1 alpha-2 country codes.
 * Used to infer a user's country from their browser's time zone.
 */
export const timeZoneToCountryCode: Record<string, string> = {
  'Africa/Abidjan': 'CI',
  'Africa/Accra': 'GH',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Algiers': 'DZ',
  'Africa/Asmara': 'ER',
  'Africa/Bamako': 'ML',
  'Africa/Bangui': 'CF',
  'Africa/Banjul': 'GM',
  'Africa/Bissau': 'GW',
  'Africa/Blantyre': 'MW',
  'Africa/Brazzaville': 'CG',
  'Africa/Bujumbura': 'BI',
  'Africa/Cairo': 'EG',
  'Africa/Casablanca': 'MA',
  'Africa/Ceuta': 'ES',
  'Africa/Conakry': 'GN',
  'Africa/Dakar': 'SN',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Djibouti': 'DJ',
  'Africa/Douala': 'CM',
  'Africa/El_Aaiun': 'EH',
  'Africa/Freetown': 'SL',
  'Africa/Gaborone': 'BW',
  'Africa/Harare': 'ZW',
  'Africa/Johannesburg': 'ZA',
  'Africa/Juba': 'SS',
  'Africa/Kampala': 'UG',
  'Africa/Khartoum': 'SD',
  'Africa/Kigali': 'RW',
  'Africa/Kinshasa': 'CD',
  'Africa/Lagos': 'NG',
  'Africa/Libreville': 'GA',
  'Africa/Lome': 'TG',
  'Africa/Luanda': 'AO',
  'Africa/Lubumbashi': 'CD',
  'Africa/Lusaka': 'ZM',
  'Africa/Malabo': 'GQ',
  'Africa/Maputo': 'MZ',
  'Africa/Maseru': 'LS',
  'Africa/Mbabane': 'SZ',
  'Africa/Mogadishu': 'SO',
  'Africa/Monrovia': 'LR',
  'Africa/Nairobi': 'KE',
  'Africa/Ndjamena': 'TD',
  'Africa/Niamey': 'NE',
  'Africa/Nouakchott': 'MR',
  'Africa/Ouagadougou': 'BF',
  'Africa/Porto-Novo': 'BJ',
  'Africa/Sao_Tome': 'ST',
  'Africa/Tripoli': 'LY',
  'Africa/Tunis': 'TN',
  'Africa/Windhoek': 'NA',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Bogota': 'CO',
  'America/Caracas': 'VE',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Guatemala': 'GT',
  'America/Halifax': 'CA',
  'America/La_Paz': 'BO',
  'America/Lima': 'PE',
  'America/Los_Angeles': 'US',
  'America/Mexico_City': 'MX',
  'America/Montevideo': 'UY',
  'America/New_York': 'US',
  'America/Phoenix': 'US',
  'America/Santiago': 'CL',
  'America/Sao_Paulo': 'BR',
  'America/Toronto': 'CA',
  'Asia/Bangkok': 'TH',
  'Asia/Colombo': 'LK',
  'Asia/Dubai': 'AE',
  'Asia/Hong_Kong': 'HK',
  'Asia/Jakarta': 'ID',
  'Asia/Kolkata': 'IN',
  'Asia/Manila': 'PH',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Singapore': 'SG',
  'Asia/Taipei': 'TW',
  'Asia/Tokyo': 'JP',
  'Australia/Brisbane': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Perth': 'AU',
  'Australia/Sydney': 'AU',
  'Europe/Amsterdam': 'NL',
  'Europe/Berlin': 'DE',
  'Europe/Brussels': 'BE',
  'Europe/Bucharest': 'RO',
  'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI',
  'Europe/Lisbon': 'PT',
  'Europe/London': 'GB',
  'Europe/Madrid': 'ES',
  'Europe/Oslo': 'NO',
  'Europe/Paris': 'FR',
  'Europe/Prague': 'CZ',
  'Europe/Rome': 'IT',
  'Europe/Stockholm': 'SE',
  'Europe/Warsaw': 'PL',
  'Pacific/Auckland': 'NZ',
}
/* eslint-enable @typescript-eslint/naming-convention */
