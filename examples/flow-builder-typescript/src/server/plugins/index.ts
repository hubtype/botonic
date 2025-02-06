import { default as FlowBuilderTypes } from '@botonic/plugin-flow-builder'
import { default as HubtypeAnalyticsTypes } from '@botonic/plugin-hubtype-analytics'
import { default as KnowledgeBasesTypes } from '@botonic/plugin-knowledge-bases'

export type BotPlugins = {
  flowBuilder: FlowBuilderTypes
  hubtypeAnalytics: HubtypeAnalyticsTypes
  knowledgeBases: KnowledgeBasesTypes
}
