import { HandOffBuilder } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { HtHandoffNode, HtPayloadNode } from './content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from './helpers'
import BotonicPluginFlowBuilder from './index'

export async function doHandoff(
  request: ActionRequest,
  locale: string,
  handoffNode: HtHandoffNode
): Promise<void> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  // @ts-ignore
  const handOffBuilder = new HandOffBuilder(request.session)
  const handoffQueues = handoffNode.content.queue
  const queueFound = handoffQueues.find(q => q.locale === locale)
  if (queueFound) handOffBuilder.withQueue(queueFound.id)

  const onFinishPayload = await getOnFinishPayload(
    flowBuilderPlugin,
    handoffNode,
    locale
  )
  if (onFinishPayload) handOffBuilder.withOnFinishPayload(onFinishPayload)
  if (handoffNode.content.has_auto_assign) {
    handOffBuilder.withAutoAssignOnWaiting(true)
  }

  // TODO: Retrieve params from FlowBuilder
  // const handoffParams = {
  //   agentEmail: 'test@gmail.com',
  //   note: 'This is a note that will be attached to the case as a reminder',
  // }

  // if (handoffParams.note) {
  //   handOffBuilder.withNote(handoffParams.note)
  // }

  // if (handoffParams.agentEmail) {
  //   handOffBuilder.withAgentEmail(handoffParams.agentEmail)
  // }

  await handOffBuilder.handOff()

  if (flowBuilderPlugin.trackEvent) {
    await flowBuilderPlugin.trackEvent(request, 'HANDOFF_SUCCESSFULL', {
      queue_id: queueFound?.id,
      queue_name: queueFound?.name,
    })
  }
}

async function getOnFinishPayload(
  flowBuilderPlugin: BotonicPluginFlowBuilder,
  handoffNode: HtHandoffNode,
  locale: string
): Promise<string | undefined> {
  if (handoffNode.target?.id) {
    const handoffTargetNode = flowBuilderPlugin.cmsApi.getNode<HtHandoffNode>(
      handoffNode.target?.id
    )
    if (handoffTargetNode?.id) return handoffTargetNode?.id
  }

  const payloadId = handoffNode.content.payload.find(
    payload => payload.locale === locale
  )?.id

  if (!payloadId) return undefined

  const actionPayload = flowBuilderPlugin.cmsApi.getNode(payloadId)

  return (actionPayload as HtPayloadNode).content.payload
}
