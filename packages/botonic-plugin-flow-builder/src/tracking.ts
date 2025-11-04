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
    if (
      nodeContent.type !== HtNodeWithContentType.KNOWLEDGE_BASE &&
      nodeContent.type !== HtNodeWithContentType.AI_AGENT
    ) {
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
  const { flowId, flowName, flowNodeId, flowNodeContentId } =
    getCommonFlowContentEventArgs(request, nodeContent)

  const flowThreadId = request.session.flow_thread_id ?? uuidv7()
  request.session.flow_thread_id = flowThreadId

  return {
    action: EventAction.FlowNode,
    flowId,
    flowName,
    flowNodeId,
    flowNodeContentId,
    flowThreadId,
    flowNodeIsMeaningful: nodeContent.is_meaningful ?? false,
  }
}

type CommonFlowContentEventArgs = {
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
}

function getCommonFlowContentEventArgs(
  request: ActionRequest,
  nodeContent: HtNodeWithContent
): CommonFlowContentEventArgs {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const flowName = flowBuilderPlugin.getFlowName(nodeContent.flow_id)

  return {
    flowId: nodeContent.flow_id,
    flowName,
    flowNodeId: nodeContent.id,
    flowNodeContentId: nodeContent.code ?? '',
  }
}

export function getCommonFlowContentEventArgsForContentId(
  request: ActionRequest,
  contentId: string
): CommonFlowContentEventArgs {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  const nodeContent = cmsApi.getNodeById<HtNodeWithContent>(contentId)

  return getCommonFlowContentEventArgs(request, nodeContent)
}
