import type { BotContext } from '@botonic/core'
import { describe, expect, jest, test } from '@jest/globals'

import { HUBTYPE_API_URL } from '../../src/constants'
import { HubtypeClientBase } from '../../src/services/hubtype-client-base'
import {
  BotonicPluginFlowBuilder,
  createServiceClientBotContext,
} from '../helpers/service-client-test-context'

class TestHubtypeClient extends HubtypeClientBase {
  getToken() {
    return this.accessToken
  }
  getUrl() {
    return this.hubtypeApiUrl
  }
}

describe('HubtypeClientBase', () => {
  test('uses HUBTYPE_API_URL from constants when settings omit API URL', () => {
    const client = new TestHubtypeClient(createServiceClientBotContext())
    expect(client.getUrl()).toBe(HUBTYPE_API_URL)
    expect(client.getToken()).toBe('test-access-token')
  })

  test('uses settings HUBTYPE_API_URL when provided', () => {
    const custom = 'https://custom.hubtype.com'
    const client = new TestHubtypeClient(
      createServiceClientBotContext({ hubtypeApi: custom })
    )
    expect(client.getUrl()).toBe(custom)
  })

  test('gets access token from flow builder plugin', () => {
    const plugin = new BotonicPluginFlowBuilder()
    const customToken = jest.fn(
      (_session: BotContext['session']) => 'from-plugin'
    )
    plugin.getAccessToken = customToken

    const botContext = createServiceClientBotContext({
      flowBuilderPlugin: plugin,
    })
    const client = new TestHubtypeClient(botContext)

    expect(client.getToken()).toBe('from-plugin')
    expect(customToken).toHaveBeenCalledWith(botContext.session)
  })
})
