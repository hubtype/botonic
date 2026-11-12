import type { BotContext } from '@botonic/core'
import { jest } from '@jest/globals'

import { FlowBuilderJSONVersion } from '../../src/types'

/**
 * Minimal plugin instance for HubtypeClientBase / getFlowBuilderPlugin (constructor name must match).
 */
export class BotonicPluginFlowBuilder {
  getAccessToken = jest.fn(
    (_session: BotContext['session']) => 'test-access-token'
  )
  jsonVersion: FlowBuilderJSONVersion = FlowBuilderJSONVersion.LATEST
}

export interface CreateServiceClientBotContextOptions {
  hubtypeApi?: string
  botId?: string
  userId?: string
  jsonVersion?: FlowBuilderJSONVersion
  isTestIntegration?: boolean
  /** If set, used instead of a new plugin instance */
  flowBuilderPlugin?: BotonicPluginFlowBuilder
}

export function createServiceClientBotContext(
  overrides: CreateServiceClientBotContextOptions = {}
): BotContext {
  const plugin = overrides.flowBuilderPlugin ?? new BotonicPluginFlowBuilder()
  if (overrides.jsonVersion !== undefined) {
    plugin.jsonVersion = overrides.jsonVersion
  }

  const session = {
    bot: { id: overrides.botId ?? 'bid1' },
    user: { id: overrides.userId ?? 'uid1' },
    ...(overrides.isTestIntegration !== undefined
      ? { is_test_integration: overrides.isTestIntegration }
      : {}),
  } as BotContext['session']

  return {
    session,
    settings: (overrides.hubtypeApi !== undefined
      ? { HUBTYPE_API_URL: overrides.hubtypeApi }
      : {}) as BotContext['settings'],
    plugins: {
      flowBuilder: plugin,
    } as BotContext['plugins'],
  } as BotContext
}
