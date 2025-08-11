import { EventAction, EventFlow } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import { v7 as uuidv7 } from 'uuid'

import { FlowContent } from './content-fields'
import {
  HtNodeWithContent,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'
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

export async function trackFlowContent(
  request: ActionRequest,
  contents: FlowContent[]
) {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  for (const content of contents) {
    const nodeContent = cmsApi.getNodeById<HtNodeWithContent>(content.id)
    if (nodeContent.type !== HtNodeWithContentType.KNOWLEDGE_BASE) {
      const event = getContentEventArgs(request, nodeContent)
      const { action, ...eventArgs } = event
      await trackEvent(request, action, eventArgs)
    }
  }
}

function getContentEventArgs(
  request: ActionRequest,
  nodeContent: HtNodeWithContent
): EventFlow {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const flowName = flowBuilderPlugin.getFlowName(nodeContent.flow_id)
  const flowThreadId = request.session.flow_thread_id ?? uuidv7()
  request.session.flow_thread_id = flowThreadId

  return {
    action: EventAction.FlowNode,
    flowThreadId,
    flowId: nodeContent.flow_id,
    flowName: flowName,
    flowNodeId: nodeContent.id,
    flowNodeContentId: nodeContent.code,
    flowNodeIsMeaningful: nodeContent.is_meaningful ?? false,
  }
}
