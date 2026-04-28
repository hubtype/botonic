import type { ToolConfigJSON } from '@botonic/core'
import { z } from 'zod'

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
    schema: z.toJSONSchema(tool.schema, {
      target: 'draft-07',
    }) as ToolConfigJSON['schema'],
  }))
}
