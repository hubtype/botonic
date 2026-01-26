import { EventAction, EventFlow } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import { v7 as uuidv7 } from 'uuid'

import { FlowBuilderApi } from './api'
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
    await trackOneContent(request, content, cmsApi)
  }
}

export async function trackOneContent(
  request: ActionRequest,
  content: FlowContent,
  cmsApi?: FlowBuilderApi
) {
  if (!cmsApi) {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    cmsApi = flowBuilderPlugin.cmsApi
  }

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

function setSessionFlowThreadId(
  request: ActionRequest,
  flowThreadId: string
): void {
  request.session.flow_thread_id = flowThreadId
}

function getContentEventArgs(
  request: ActionRequest,
  nodeContent: HtNodeWithContent
): EventFlow {
  const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
    getCommonFlowContentEventArgs(request, nodeContent)

  setSessionFlowThreadId(request, flowThreadId)

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
  flowThreadId: string
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
  const flowThreadId = request.session.flow_thread_id ?? uuidv7()

  return {
    flowThreadId,
    flowId: nodeContent.flow_id,
    flowName,
    flowNodeId: nodeContent.id,
    flowNodeContentId: nodeContent.code ?? '',
  }
}

export function getCommonFlowContentEventArgsForContentId(
  request: ActionRequest,
  id: string
): CommonFlowContentEventArgs {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  const nodeContent = cmsApi.getNodeById<HtNodeWithContent>(id)

  return getCommonFlowContentEventArgs(request, nodeContent)
}
