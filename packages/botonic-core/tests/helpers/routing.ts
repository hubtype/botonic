import { PATH_PAYLOAD_IDENTIFIER, PROVIDER, Session } from '../../src'

export function testRoute(): any {
  return {}
}

export function testSession(): Session {
  return {
    user: { id: 'userid', provider: PROVIDER.DEV },
    bot: { id: 'bot_id' },
    is_first_interaction: true,
    organization: 'test_org',
    organization_id: '1234567890',
    __retries: 0,
  }
}

export const createPathPayload = (pathWithParams: string): string =>
  `${PATH_PAYLOAD_IDENTIFIER}${pathWithParams}`
