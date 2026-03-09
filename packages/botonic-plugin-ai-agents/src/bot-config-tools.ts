import type { ToolConfigJSON } from '@botonic/core'
import { zodToJsonSchema } from 'zod-to-json-schema'

import type { CustomTool } from './types'

/**
 * Maps custom AI agent tools to the format expected by bot config (e.g. for flow-builder).
 * Converts each tool's Zod schema to JSON Schema so it can be serialized in the config.
 */
export function getToolsForBotConfig(
  customTools: CustomTool[]
): ToolConfigJSON[] {
  return customTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    schema: zodToJsonSchema(tool.schema, { $refStrategy: 'none' }),
  }))
}
