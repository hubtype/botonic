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

  if ('aiAgentRouterContent' in splitContents) {
    const { aiAgentRouterContent, contentsBeforeAiAgentRouter } = splitContents
    const aiAgentResponse = await aiAgentRouterContent.resolveAIAgentResponse(
      request,
      contentsBeforeAiAgentRouter
    )

    if (!aiAgentResponse || aiAgentResponse.exit) {
      return []
    }
  }

  if ('aiAgentWorkerContent' in splitContents) {
    const { aiAgentWorkerContent, contentsBeforeAiAgentWorker } = splitContents
    const aiAgentResponse = await aiAgentWorkerContent.resolveAIAgentResponse(
      request,
      contentsBeforeAiAgentWorker
    )

    if (!aiAgentResponse || aiAgentResponse.exit) {
      return []
    }
  }

  return contents
}
