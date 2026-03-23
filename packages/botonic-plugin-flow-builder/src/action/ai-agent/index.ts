import {
  type AgenticOutputMessage,
  type BotContext,
  EventAction,
  type EventAiAgent,
  type InferenceResponse,
} from '@botonic/core'

import { FlowAiAgent, type FlowContent } from '../../content-fields'
import type { HtNodeWithContent } from '../../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../../helpers'
import { trackEvent } from '../../tracking'
import type { GuardrailRule } from '../../types'
import type { FlowBuilderContext } from '../index'
import {
  type FlowBuilderContentMessage,
  FlowBuilderContentSchema,
} from './structured-output/flow-builder-content'

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
      ?.filter(rule => rule.is_active)
      ?.map(rule => ({
        name: rule.name,
        description: rule.description,
      })) || []

  const aiAgentResponse = await flowBuilderPlugin.getAiAgentResponse?.(
    request,
    {
      name: aiAgentContent.name,
      instructions: aiAgentContent.instructions,
      model: aiAgentContent.model,
      verbosity: aiAgentContent.verbosity,
      activeTools: aiAgentContent.activeTools,
      inputGuardrailRules: activeInputGuardrailRules,
      sourceIds: aiAgentContent.sources?.map(source => source.id),
      outputMessagesSchemas: [FlowBuilderContentSchema],
    }
  )

  if (!aiAgentResponse) {
    return []
  }
  await trackAiAgentResponse(aiAgentResponse, request, aiAgentContent)

  if (aiAgentResponse.exit) {
    return []
  }

  const regularMessages: AgenticOutputMessage[] = []
  const flowBuilderContentMessages: FlowBuilderContentMessage[] = []

  for (const message of aiAgentResponse.messages) {
    if (message.type === 'flowBuilderContent') {
      flowBuilderContentMessages.push(message as FlowBuilderContentMessage)
    } else {
      regularMessages.push(message as AgenticOutputMessage)
    }
  }

  const result: FlowContent[] = []

  if (regularMessages.length > 0) {
    aiAgentContent.responses = regularMessages
    result.push(...contents)
  }

  for (const fbMessage of flowBuilderContentMessages) {
    try {
      const node = cmsApi.getNodeByContentID(fbMessage.contentId)
      const targetNode = cmsApi.getNodeById<HtNodeWithContent>(node.id)
      const flowContents = await flowBuilderPlugin.getContentsByNode(targetNode)
      result.push(...flowContents)
    } catch (error) {
      console.warn(
        `Could not resolve flowBuilderContent with contentId "${fbMessage.contentId}":`,
        error
      )
    }
  }

  return result
}

async function trackAiAgentResponse(
  aiAgentResponse: InferenceResponse<FlowBuilderContentMessage>,
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
    flowNodeContentId: aiAgentContent.name,
    flowNodeIsMeaningful: true,
    toolsExecuted: aiAgentResponse?.toolsExecuted ?? [],
    memoryLength: aiAgentResponse?.memoryLength ?? 0,
    inputMessageId: request.input.message_id!,
    exit: aiAgentResponse?.exit ?? true,
    inputGuardrailsTriggered: aiAgentResponse?.inputGuardrailsTriggered ?? [],
    outputGuardrailsTriggered: [], //aiAgentResponse.outputGuardrailsTriggered,
    error: aiAgentResponse.error,
  }
  const { action, ...eventArgs } = event

  await trackEvent(request, action, eventArgs)
}
