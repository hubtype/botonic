import { FlowAiAgent, type FlowContent } from '../content-fields'
import type { FlowBuilderContext } from './index'

export async function getContentsByAiAgent({
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

  const splitContents = splitAiAgentAndContentsBefore(contents)
  if (!splitContents) {
    return []
  }
  const { aiAgentContent, contentsBeforeAiAgent } = splitContents

  const aiAgentResponse = await aiAgentContent.getAIAgentResponse(
    request,
    contentsBeforeAiAgent
  )

  if (!aiAgentResponse) {
    return []
  }
  aiAgentContent.aiAgentResponse = aiAgentResponse
  await aiAgentContent.trackAiAgentResponse(request)

  if (aiAgentResponse.exit) {
    return []
  }

  aiAgentContent.messages = aiAgentResponse.messages

  return contents
}

interface SplitAiAgentAndContentsBeforeResult {
  aiAgentContent: FlowAiAgent
  contentsBeforeAiAgent: FlowContent[]
}

export function splitAiAgentAndContentsBefore(
  contents: FlowContent[]
): SplitAiAgentAndContentsBeforeResult | undefined {
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
