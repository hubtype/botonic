import { FlowContent } from '../content-fields'
import { FlowAiAgent } from '../content-fields/flow-ai-agent'
import { GuardrailRule } from '../types'
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

  const activeInputGuardrailRules: GuardrailRule[] =
    aiAgentContent.inputGuardrailRules
      .filter(rule => rule.is_active)
      .map(rule => ({
        name: rule.name,
        description: rule.description,
      }))

  const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
    request,
    {
      name: aiAgentContent.name,
      instructions: aiAgentContent.instructions,
      activeTools: aiAgentContent.activeTools,
      inputGuardrailRules: activeInputGuardrailRules,
    }
  )

  if (!aiAgentResponse) {
    return []
  }

  if (aiAgentResponse.exit) {
    return []
  }

  aiAgentContent.responses = aiAgentResponse.messages

  return contents
}
