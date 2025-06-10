import { DynamicStructuredTool, tool } from '@langchain/core/tools'

import { CustomTool } from '../types'

export function createCustomTool(
  customTool: CustomTool
): DynamicStructuredTool {
  return tool(customTool.func, {
    name: customTool.name,
    description: customTool.description,
    schema: customTool.schema,
    returnDirect: customTool.returnDirect || false,
  })
}
