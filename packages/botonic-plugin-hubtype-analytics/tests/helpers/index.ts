import {
  type BotContext,
  INPUT,
  PROVIDER,
  type ProviderType,
  type ResolvedPlugins,
} from '@botonic/core'

import BotonicPluginHubtypeAnalytics from '../../src/index'

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

export function createRequest(args?: RequestArgs): BotContext<ResolvedPlugins> {
  return {
    session: {
      is_first_interaction: args?.isFirstInteraction || false,
      organization: 'orgTest',
      organization_id: 'orgIdTest',
      bot: { id: 'bid1' },
      user: {
        locale: args?.language || 'es',
        country: args?.country || 'ES',
        system_locale: args?.language || 'es',
        provider: args?.provider || PROVIDER.WEBCHAT,
        id: args?.chatId || 'chatIdTest',
        extra_data: {},
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
    settings: {
      HUBTYPE_API_URL: 'https://api.hubtype.com',
      STATIC_URL: 'https://static.hubtype.com',
      LITELLM_API_URL: 'https://api.litellm.com',
      AZURE_OPENAI_API_BASE: 'https://api.openai.com',
      AZURE_OPENAI_API_VERSION: '2026-02-01',
      LANGUAGE_DETECTION_ENABLED: 'true',
      CUSTOM_SHORT_URL_HOST: null,
      custom: {},
    },
    secrets: {
      HUBTYPE_ACCESS_TOKEN: 'testAccessToken',
      LITELLM_API_KEY: 'testLiteLLMAPIKey',
      AZURE_OPENAI_API_KEY: 'testAzureOpenAIAPIKey',
      custom: {},
    },
    getUserCountry: () => args?.country || 'ES',
    getUserLocale: () => args?.language || 'es',
    getSystemLocale: () => args?.language || 'es',
    setUserCountry: () => {
      return
    },
    setUserLocale: () => {
      return
    },
    setSystemLocale: () => {
      return
    },
    defaultDelay: 0,
    defaultTyping: 0,
    params: {},
    plugins: {},
  }
}
