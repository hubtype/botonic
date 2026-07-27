import type { ResolvedPlugins } from '@botonic/core'
import BotonicPluginAiAgents from '@botonic/plugin-ai-agents'
import BotonicPluginFlowBuilder, {
  type BotonicPluginFlowBuilderOptions,
} from '@botonic/plugin-flow-builder'
import BotonicPluginHubtypeAnalytics from '@botonic/plugin-hubtype-analytics'

import { CONFIG } from './config'
import { getEnvironment } from './utils/env-utils'

const config = CONFIG[getEnvironment()]

export type BotPlugins = typeof plugins

export const plugins = {
  flowBuilder: new BotonicPluginFlowBuilder(
    config.flowBuilder as BotonicPluginFlowBuilderOptions<ResolvedPlugins>
  ),
  aiAgents: new BotonicPluginAiAgents(config.aiAgents),
  hubtypeAnalytics: new BotonicPluginHubtypeAnalytics(),
}
