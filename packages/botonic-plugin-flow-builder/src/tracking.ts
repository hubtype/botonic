import { ActionRequest } from '@botonic/react'

import { FlowContent } from './content-fields'
import { HtNodeWithContent } from './content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from './helpers'

export enum EventAction {
  FlowNode = 'flow_node',
  Keyword = 'nlu_keyword',
  Intent = 'nlu_intent',
  IntentSmart = 'nlu_intent_smart',
  Knowledgebase = 'knowledgebase',
  Fallback = 'fallback',
}

export enum KnowledgebaseFailReason {
  NoKnowledge = 'no_knowledge',
  Hallucination = 'hallucination',
}

export async function trackEvent(
  request: ActionRequest,
  eventAction: EventAction,
  args?: Record<string, any>
): Promise<void> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  if (flowBuilderPlugin.trackEvent) {
    await flowBuilderPlugin.trackEvent(request, eventAction, args)
  }
  return
}

export async function trackFlowContent(
  request: ActionRequest,
  contents: FlowContent[]
) {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  const firstNodeContent = cmsApi.getNodeById<HtNodeWithContent>(contents[0].id)
  const flowName = flowBuilderPlugin.getFlowName(firstNodeContent.flow_id)
  const eventArgs = getContentEventArgs(request, {
    code: firstNodeContent.code,
    flowId: firstNodeContent.flow_id,
    flowName,
    id: firstNodeContent.id,
  })
  await trackEvent(request, EventAction.FlowNode, eventArgs)
}

export function getContentEventArgs(
  request: ActionRequest,
  contentInfo: {
    code: string
    flowId: string
    flowName: string
    id: string
  }
) {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  return {
    flowThreadId: request.session.flow_thread_id,
    flowId: contentInfo.flowId,
    flowName: flowBuilderPlugin.getFlowName(contentInfo.flowId),
    flowNodeId: contentInfo.id,
    flowNodeContentId: contentInfo.code,
    flowNodeIsMeaningful: undefined, //node?.isMeaningful,
  }
}

// export enum EventName {
//   feedback = 'feedback',
//   flow = 'botevent',

//   botOpen = 'bot_open',
//   botAiModel = 'bot_ai_model',
//   botAiKnowledgeBase = 'bot_ai_knowledge_base',
//   botKeywordsModel = 'bot_keywords_model',
//   fallback = 'fallback',
//   handoffOption = 'handoff_option',
//   handoffSuccess = 'handoff_success',
//   handoffFail = 'handoff_fail',
// }
