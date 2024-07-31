import { BotRequest, INPUT, PROVIDER, ProviderType } from '@botonic/core'

import BotonicPluginHubtypeAnalytics from '../../src'

interface RequestArgs {
  language?: string
  country?: string
  provider?: ProviderType
  chatId?: string
  isFirstInteraction?: boolean
}

export function getRequestData(args?: RequestArgs) {
  const request = createRequest(args)
  const hubtypeAnalyticsPlugin = new BotonicPluginHubtypeAnalytics()
  return hubtypeAnalyticsPlugin.getRequestData(request)
}

export function createRequest(args?: RequestArgs): BotRequest {
  return {
    session: {
      is_first_interaction: args?.isFirstInteraction || false,
      organization: 'orgTest',
      organization_id: 'orgIdTest',
      bot: { id: 'bid1' },
      user: {
        provider: args?.provider || PROVIDER.WEBCHAT,
        id: args?.chatId || 'chatIdTest',
        extra_data: {
          country: args?.country || 'ES',
          language: args?.language || 'es',
        },
      },
      __retries: 0,
      _access_token: 'fake_access_token',
      _hubtype_api: 'https://api.hubtype.com',
      is_test_integration: false,
      flow_thread_id: 'testFlowThreadId',
    },
    input: {
      data: 'Hola',
      type: INPUT.TEXT,
      bot_interaction_id: 'testInteractionId',
      message_id: 'testMessageId',
    },
    lastRoutePath: '',
  }
}
