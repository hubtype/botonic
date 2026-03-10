import type { BotConfigJSON } from '@botonic/core'
import { getToolsForBotConfig } from '@botonic/plugin-ai-agents'

import { customTools } from './server/tools'

const aiAgentTools = getToolsForBotConfig(customTools ?? [])

/**
 * This is the configuration is shared with flow-builder-frontend.
 */
export const botConfig: BotConfigJSON = {
  tools: aiAgentTools,
  payloads: [],
  webviews: [],
}
