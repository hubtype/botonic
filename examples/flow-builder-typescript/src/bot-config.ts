import type { BotConfigJSON } from '@botonic/core'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { customTools } from './server/tools'

const aiAgentTools =
  customTools?.map(customTool => ({
    name: customTool.name,
    schema: zodToJsonSchema(customTool.schema, { $refStrategy: 'none' }),
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
