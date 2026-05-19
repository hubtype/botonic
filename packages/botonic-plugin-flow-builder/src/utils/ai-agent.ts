import { FlowAiAgentRouter } from '../content-fields/flow-ai-agent-router'
import { FlowAiAgent, type FlowContent } from '../content-fields/index'

export { HubtypeAssistantContent } from './hubtype-assistant-content'

type AiAgentContentAndContentsBeforeAiAgent =
  | {
      aiAgentWorkerContent: FlowAiAgent
      contentsBeforeAiAgentWorker: FlowContent[]
    }
  | {
      aiAgentRouterContent: FlowAiAgentRouter
      contentsBeforeAiAgentRouter: FlowContent[]
    }

export function splitAiAgentContents(
  contents: FlowContent[]
): AiAgentContentAndContentsBeforeAiAgent | undefined {
  const aiAgentRouterIndex = contents.findIndex(
    content => content instanceof FlowAiAgentRouter
  )
  if (aiAgentRouterIndex >= 0) {
    return {
      aiAgentRouterContent: contents[aiAgentRouterIndex] as FlowAiAgentRouter,
      contentsBeforeAiAgentRouter: contents.slice(0, aiAgentRouterIndex),
    }
  }

  const aiAgentIndex = contents.findIndex(
    content => content instanceof FlowAiAgent
  )
  if (aiAgentIndex < 0) {
    return undefined
  }

  const aiAgentWorkerContent = contents[aiAgentIndex] as FlowAiAgent
  const contentsBeforeAiAgentWorker = contents.slice(0, aiAgentIndex)

  return {
    aiAgentWorkerContent,
    contentsBeforeAiAgentWorker,
  }
}
