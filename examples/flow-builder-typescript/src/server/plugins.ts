import BotonicPluginAiAgents from '@botonic/plugin-ai-agents'
import BotonicPluginFlowBuilder from '@botonic/plugin-flow-builder'
import BotonicPluginHubtypeAnalytics from '@botonic/plugin-hubtype-analytics'
import BotonicPluginKnowledgeBases from '@botonic/plugin-knowledge-bases'

import { CONFIG } from './config'
import { getEnvironment } from './utils/env-utils'

const config = CONFIG[getEnvironment()]

export type BotPlugins = typeof plugins

export const plugins = {
  flowBuilder: new BotonicPluginFlowBuilder(config.flowBuilder),
  aiAgents: new BotonicPluginAiAgents(config.aiAgents),
  knowledgeBases: new BotonicPluginKnowledgeBases(config.knowledgeBases),
  hubtypeAnalytics: new BotonicPluginHubtypeAnalytics(),
}
