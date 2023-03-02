import { getOpenQueues, HandOffBuilder } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

// TODO: Remove all "getOpenQueues" logic and open/closed messages.
// This function should just do a basic handoff
// TODO: add missing options: withNote, withAgent

export async function doHandoff(request: ActionRequest) {
  // @ts-ignore
  const flowBuilderPlugin = request.plugins.hubtypeFlowBuilder as any
  const handoffContent = await flowBuilderPlugin.getHandoffContent()
  // @ts-ignore
  let openQueues = await getOpenQueues(request.session)
  const queueName = 'Test'
  if (openQueues.queues.indexOf(queueName) !== -1) {
    // @ts-ignore
    const handOffBuilder = new HandOffBuilder(request.session)
    handOffBuilder.withQueue('Test')
    handOffBuilder.withOnFinishPayload(handoffContent.target?.id!)
    await handOffBuilder.handOff()

    return handoffContent.content.message[0].message
  }

  return handoffContent.content.failMessage[0].message
}
