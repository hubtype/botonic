import { HandOffBuilder } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { HandoffNode } from './flow-builder-models'
import { getFlowBuilderPlugin } from './helpers'

export async function doHandoff(
  request: ActionRequest,
  locale: string,
  handoffNode: HandoffNode
): Promise<void> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const handoffTargetNode = await flowBuilderPlugin.getHandoffContent(
    handoffNode.target?.id
  )
  // @ts-ignore
  const handOffBuilder = new HandOffBuilder(request.session) // handOffBuilder.withQueue(handoffNode.content.queue)
  const handoffQueues = handoffNode.content.queue
  const queueFound = handoffQueues.find(q => q.locale === locale)
  if (queueFound) handOffBuilder.withQueue(queueFound.id)
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

  handOffBuilder.withOnFinishPayload(handoffTargetNode.id)
  await handOffBuilder.handOff()
}
