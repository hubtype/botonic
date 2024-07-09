import { PATH_PAYLOAD_IDENTIFIER, PROVIDER, Session } from '../../src'

export function testRoute(): any {
  return {}
}

export function testSession(): Session {
  return {
    user: { id: 'userid', provider: PROVIDER.DEV },
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
