import { PATH_PAYLOAD_IDENTIFIER, PROVIDER, Session } from '../../src'
import { COUNTRY_GB, LOCALE_EN } from './core-bot'

export function testRoute(): any {
  return {}
}

export function testSession(): Session {
  return {
    user: {
      id: 'userid',
      provider: PROVIDER.DEV,
      country: COUNTRY_GB,
      locale: LOCALE_EN,
      system_locale: LOCALE_EN,
    },
    bot: { id: 'bot_id' },
    _access_token: '1234',
    _hubtype_api: 'app.hubtype.com',
    is_first_interaction: true,
    is_test_integration: false,
    organization: 'test_org',
    organization_id: '1234567890',
    __retries: 0,
  }
}

export const createPathPayload = (pathWithParams: string): string =>
  `${PATH_PAYLOAD_IDENTIFIER}${pathWithParams}`
