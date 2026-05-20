import type { ToolExecuted } from './types'

export const RETRIEVE_KNOWLEDGE_TOOL = 'retrieve_knowledge'

const TRANSFER_TOOL_PREFIX = 'transfer_to_'

export function parseTools(
  tools: ToolExecuted[],
  excludeTransferTools = false
) {
  const result = {
    retrieveKnowledgeTools: [] as ToolExecuted[],
    otherTools: [] as ToolExecuted[],
    allSourcesIds: [] as string[],
    allChunksIds: [] as string[],
    query: undefined as string | undefined,
  }

  for (const tool of tools) {
    if (tool.tool_name !== RETRIEVE_KNOWLEDGE_TOOL) {
      if (
        !(
          excludeTransferTools &&
          tool.tool_name.startsWith(TRANSFER_TOOL_PREFIX)
        )
      ) {
        result.otherTools.push(tool)
      }
      continue
    }

    result.retrieveKnowledgeTools.push(tool)

    if (typeof tool.tool_arguments?.query === 'string') {
      result.query = tool.tool_arguments.query
    }

    result.allSourcesIds.push(...(tool.knowledgebase_sources_ids ?? []))
    result.allChunksIds.push(...(tool.knowledgebase_chunks_ids ?? []))
  }

  return result
}
