import { FlowAiAgent, type FlowContent } from '../content-fields/index'
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

interface AiAgentContentAndContentsBeforeAiAgent {
  aiAgentContent: FlowAiAgent
  contentsBeforeAiAgent: FlowContent[]
}

export function splitAiAgentContents(
  contents: FlowContent[]
): AiAgentContentAndContentsBeforeAiAgent | undefined {
  const aiAgentIndex = contents.findIndex(
    content => content instanceof FlowAiAgent
  )
  if (aiAgentIndex < 0) {
    return undefined
  }

  const aiAgentContent = contents[aiAgentIndex] as FlowAiAgent
  const contentsBeforeAiAgent = contents.slice(0, aiAgentIndex)

  return { aiAgentContent, contentsBeforeAiAgent }
}
