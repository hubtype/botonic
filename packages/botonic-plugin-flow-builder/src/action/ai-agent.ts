import { BotContext, EventAction, EventAiAgent } from '@botonic/core'

import { FlowAiAgent, FlowContent } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import { trackEvent } from '../tracking'
import { AiAgentInferenceResponse } from '../types'
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
  trackAiAgentResponse(aiAgentResponse, request, aiAgentContent)

  if (aiAgentResponse.exit) {
    return []
  }

  aiAgentContent.responses = aiAgentResponse.messages

  return contents
}

async function trackAiAgentResponse(
  aiAgentResponse: AiAgentInferenceResponse,
  request: BotContext,
  aiAgentContent: FlowAiAgent
) {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const flowId = flowBuilderPlugin.cmsApi.getNodeById<HtNodeWithContent>(
    aiAgentContent.id
  ).flow_id
  const flowName = flowBuilderPlugin.getFlowName(flowId)

  const event: EventAiAgent = {
    action: EventAction.AiAgent,
    flowThreadId: request.session.flow_thread_id!,
    flowId: flowId,
    flowName: flowName,
    flowNodeId: aiAgentContent.id,
    flowNodeContentId: aiAgentContent.code,
    flowNodeIsMeaningful: true,
    toolsExecuted: aiAgentResponse.toolsExecuted,
    exit: aiAgentResponse.exit,
    inputGuardrailTriggered: aiAgentResponse.inputGuardrailTriggered,
    outputGuardrailTriggered: [], //aiAgentResponse.outputGuardrailTriggered,
    error: false, // aiAgentResponse.error,
    messageId: request.input.message_id!,
  }
  const { action, ...eventArgs } = event

  await trackEvent(request, action, eventArgs)
}
