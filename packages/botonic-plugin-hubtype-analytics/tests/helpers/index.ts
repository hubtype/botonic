import {
  type BotContext,
  type ProviderType,
  type ResolvedPlugins,
} from '@botonic/core'
import { createTestBotContext } from '@botonic/core/testing'

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
  return createTestBotContext({
    session: {
      isFirstInteraction: args?.isFirstInteraction ?? false,
      organization: 'orgTest',
      organizationId: 'orgIdTest',
      botId: 'bid1',
      user: {
        id: args?.chatId ?? 'chatIdTest',
        provider: args?.provider,
        locale: args?.language ?? 'es',
        country: args?.country ?? 'ES',
        systemLocale: args?.language ?? 'es',
      },
    },
    input: {
      data: 'Hola',
    },
  })
}
