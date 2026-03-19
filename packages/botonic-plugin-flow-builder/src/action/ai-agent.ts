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

  const aiAgentContent = contents.find(
    content => content instanceof FlowAiAgent
  ) as FlowAiAgent

  if (!aiAgentContent) {
    return []
  }

  const aiAgentResponse = await aiAgentContent.getAIAgentResponse(request)

  if (!aiAgentResponse) {
    return []
  }
  await aiAgentContent.trackAiAgentResponse(request)

  if (aiAgentResponse.exit) {
    return []
  }

  aiAgentContent.messages = aiAgentResponse.messages

  return contents
}
