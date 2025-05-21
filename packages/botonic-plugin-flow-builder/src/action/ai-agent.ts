import { FlowContent } from '../content-fields'
import { FlowAiAgent } from '../content-fields/flow-ai-agent'
import { AiAgentResponse } from '../types'
import { FlowBuilderContext } from './index'

export async function getContentsByAiAgent({
  cmsApi,
  flowBuilderPlugin,
  request,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const startNodeAiAgentFlow = cmsApi.getStartNodeAiAgentFlow()
  if (!startNodeAiAgentFlow) {
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

  const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
    request,
    {
      name: aiAgentContent.name,
      instructions: aiAgentContent.instructions,
    }
  )

  if (!aiAgentResponse) {
    return []
  }

  return updateContentsWithAiAgentResponse(contents, aiAgentResponse)
}

function updateContentsWithAiAgentResponse(
  contents: FlowContent[],
  aiAgentResponse: AiAgentResponse
): FlowContent[] {
  if (
    aiAgentResponse.message.role === 'tool' &&
    aiAgentResponse.message.tool_name === 'exit_agent'
  ) {
    return []
  }

  return contents.map(content => {
    if (
      content instanceof FlowAiAgent &&
      aiAgentResponse.message.role === 'assistant'
    ) {
      content.text = aiAgentResponse.message.content
    }

    return content
  })
}
