import { ActionRequest } from '@botonic/react'
import { v7 as uuidv7 } from 'uuid'

import { FlowContent } from './content-fields'
import {
  HtNodeWithContent,
  HtNodeWithContentType,
  HtNodeWithoutContentType,
} from './content-fields/hubtype-fields'
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
  for (const content of contents) {
    const nodeContent = cmsApi.getNodeById<HtNodeWithContent>(content.id)
    if (nodeContent.type !== HtNodeWithContentType.KNOWLEDGE_BASE) {
      const eventArgs = getContentEventArgs(request, {
        code: nodeContent.code,
        flowId: nodeContent.flow_id,
        flowName: flowBuilderPlugin.getFlowName(nodeContent.flow_id),
        id: nodeContent.id,
        isMeaningful: nodeContent.is_meaningful ?? false,
      })
      await trackEvent(request, EventAction.FlowNode, eventArgs)
    }
  }
}

function getContentEventArgs(
  request: ActionRequest,
  contentInfo: {
    code: string
    flowId: string
    flowName: string
    id: string
    isMeaningful: boolean
  }
) {
  const flowThreadId = request.session.flow_thread_id ?? uuidv7()
  request.session.flow_thread_id = flowThreadId

  return {
    flowThreadId,
    flowId: contentInfo.flowId,
    flowName: contentInfo.flowName,
    flowNodeId: contentInfo.id,
    flowNodeContentId: contentInfo.code,
    flowNodeIsMeaningful: contentInfo.isMeaningful,
  }
}
