import { HandOffBuilder } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { HandoffNode, PayloadNode } from './flow-builder-models'
import { getFlowBuilderPlugin } from './helpers'
import BotonicPluginFlowBuilder from './index'

export async function doHandoff(
  request: ActionRequest,
  locale: string,
  handoffNode: HandoffNode
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
      queueName: queueFound?.name,
    })
  }
}

async function getOnFinishPayload(
  flowBuilderPlugin: BotonicPluginFlowBuilder,
  handoffNode: HandoffNode,
  locale: string
): Promise<string | undefined> {
  const handoffTargetNode = await flowBuilderPlugin.getHandoffContent(
    handoffNode.target?.id
  )
  if (handoffTargetNode?.id) return handoffTargetNode?.id

  const payloadId = handoffNode.content.payload.find(
    payload => payload.locale === locale
  )?.id

  if (!payloadId) return undefined

  const actionPayload = await flowBuilderPlugin.getContent(payloadId)

  return (actionPayload as PayloadNode).content.payload
}
