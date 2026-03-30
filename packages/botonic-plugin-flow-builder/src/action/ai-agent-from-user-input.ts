import type { FlowContent } from '../content-fields/index'
import { splitAiAgentContents } from '../utils/ai-agent'
import type { FlowBuilderContext } from './context'

export async function getContentsByAiAgentFromUserInput({
  cmsApi,
  flowBuilderPlugin,
  request,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const startNodeAiAgentFlow = cmsApi.getStartNodeAiAgentFlow()
  const isAiAgentEnabled = cmsApi.isAiAgentEnabled()
  if (!startNodeAiAgentFlow || !isAiAgentEnabled) {
    return []
  }

  const contents =
    await flowBuilderPlugin.getContentsByNode(startNodeAiAgentFlow)

  const splitContents = splitAiAgentContents(contents)
  if (!splitContents) {
    return []
  }
  const { aiAgentContent, contentsBeforeAiAgent } = splitContents

  const aiAgentResponse = await aiAgentContent.resolveAIAgentResponse(
    request,
    contentsBeforeAiAgent
  )

  if (!aiAgentResponse || aiAgentResponse.exit) {
    return []
  }

  return contents
}
