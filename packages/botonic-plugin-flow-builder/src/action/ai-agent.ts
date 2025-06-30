import { SOURCE_INFO_SEPARATOR } from '../constants'
import { FlowButton, FlowContent, FlowElement } from '../content-fields'
import { FlowAiAgent } from '../content-fields/flow-ai-agent'
import { FlowCarousel } from '../content-fields/flow-carousel'
import { AiAgentResponse } from '../types'
import { FlowBuilderContext } from './index'

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

  const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
    request,
    {
      name: aiAgentContent.name,
      instructions: aiAgentContent.instructions,
      activeTools: aiAgentContent.activeTools,
    }
  )

  console.log('FlowBuilder: aiAgentResponse', aiAgentResponse)

  if (!aiAgentResponse || aiAgentResponse.role === 'exit') {
    return []
  }

  if (aiAgentResponse.role === 'tool') {
    if (aiAgentResponse.toolName === 'generateCarouselMessage') {
      return updateContentsWithCarouselMessage(contents, aiAgentResponse)
    }
    if (aiAgentResponse.toolName === 'generateMessageWithButtons') {
      return updateFlowAiAgentWithTextAndButtons(contents, aiAgentResponse)
    }
    return []
  }

  return updateFlowAiAgentWithText(contents, aiAgentResponse)
}

function updateFlowAiAgentWithText(
  contents: FlowContent[],
  aiAgentResponse: AiAgentResponse
): FlowContent[] {
  return contents.map(content => {
    if (content instanceof FlowAiAgent) {
      content.text = aiAgentResponse.content || ''
    }

    return content
  })
}

function updateFlowAiAgentWithTextAndButtons(
  contents: FlowContent[],
  aiAgentResponse: AiAgentResponse
): FlowContent[] {
  const toolOutputJson = JSON.parse(aiAgentResponse.toolOutput || '{}')
  console.log('FlowBuilder: toolOutputJson', toolOutputJson)

  return contents.map(content => {
    if (content instanceof FlowAiAgent && toolOutputJson.buttons) {
      content.text = toolOutputJson?.text || ''
      content.buttons =
        toolOutputJson?.buttons.map((button, buttonIndex) => {
          return FlowButton.fromAIAgent({
            id: `ai-agent-button-${buttonIndex}`,
            text: button.text,
            payload: `${button.payload}${SOURCE_INFO_SEPARATOR}${buttonIndex}`,
          })
        }) || []
    }
    console.log('FlowBuilder: updateFlowAiAgentWithTextAndButtons', content)

    return content
  })
}

function updateContentsWithCarouselMessage(
  contents: FlowContent[],
  aiAgentResponse: AiAgentResponse
): FlowContent[] {
  console.log('aiAgentResponse:', aiAgentResponse)
  const toolOutput = JSON.parse(aiAgentResponse.toolOutput || '{}')
  console.log('toolOutput:', toolOutput)
  const updatedContents = contents.map(content => {
    if (content instanceof FlowAiAgent && toolOutput.elements) {
      content.outputType = 'carousel'
      content.elements = toolOutput.elements.map((element, index) =>
        FlowElement.fromAIAgent(index.toString(), element)
      )
    }
    return content
  })
  return updatedContents
}
