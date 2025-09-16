import { BotConfigJSON } from '@botonic/core'

import { customTools } from './server/tools'

const aiAgentTools =
  customTools?.map(customTool => ({
    name: customTool.name,
    description: customTool.description,
  })) || []

/**
 * This is the configuration is shared with flow-builder-frontend.
 */
export const botConfig: BotConfigJSON = {
  tools: aiAgentTools,
  payloads: [],
  webviews: [],
}
