import { HandOffBuilder } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import { getFlowBuilderPlugin } from './helpers'

export async function doHandoff(
  request: ActionRequest,
  queue: string,
  note?: string,
  agentEmail?: string
): Promise<void> {
  // @ts-ignore
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const handoffContent = await flowBuilderPlugin.getHandoffContent()

  // @ts-ignore
  const handOffBuilder = new HandOffBuilder(request.session)
  handOffBuilder.withQueue(queue)

  if (note) {
    handOffBuilder.withNote(note)
  }

  if (agentEmail) {
    handOffBuilder.withAgentEmail(agentEmail)
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  handOffBuilder.withOnFinishPayload(handoffContent.target?.id!)
  await handOffBuilder.handOff()
}
