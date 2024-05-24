import { ActionRequest } from '@botonic/react'

import { HtNodeWithContent } from './content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from './helpers'

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

export function getNodeEventArgs(
  request: ActionRequest,
  node: HtNodeWithContent
) {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  return {
    flowThreadId: request.session.flow_thread_id,
    flowId: node.flow_id,
    flowName: flowBuilderPlugin.getFlowName(node.flow_id),
    flowNodeId: node.id,
    flowNodeContentId: node.code,
    flowNodeIsMeaningful: undefined, //node?.isMeaningful,
  }
}

export enum EventAction {
  flowNode = 'flow_node',
  handoffOption = 'handoff_option',
  handoffSuccess = 'handoff_success',
  handoffFail = 'handoff_fail',
  keyword = 'nlu_keyword',
  intent = 'nlu_intent',
  intentSmart = 'nlu_intent_smart',
  knowledgebase = 'knowledgebase',
  fallback = 'fallback',
}
