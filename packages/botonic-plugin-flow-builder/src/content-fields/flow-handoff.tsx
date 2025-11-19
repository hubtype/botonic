import { HandOffBuilder, HelpdeskEvent, isDev, isWebchat } from '@botonic/core'
import { ActionRequest, WebchatSettings } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { getCommonFlowContentEventArgsForContentId } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtHandoffNode, HtQueueLocale } from './hubtype-fields'

export class FlowHandoff extends ContentFieldsBase {
  public code: string
  public queue?: HtQueueLocale
  public onFinishPayload?: string
  public handoffAutoAssign: boolean
  public hasQueuePositionChangedNotificationsEnabled: boolean
  public isTestIntegration: boolean

  static fromHubtypeCMS(
    cmsHandoff: HtHandoffNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowHandoff {
    const newHandoff = new FlowHandoff(cmsHandoff.id)
    newHandoff.code = cmsHandoff.code
    newHandoff.queue = this.getQueueByLocale(locale, cmsHandoff.content.queue)
    newHandoff.onFinishPayload = this.getOnFinishPayload(cmsHandoff, cmsApi)
    newHandoff.handoffAutoAssign = cmsHandoff.content.has_auto_assign
    newHandoff.hasQueuePositionChangedNotificationsEnabled =
      cmsHandoff.content.has_queue_position_changed_notifications_enabled
    return newHandoff
  }

  private static getOnFinishPayload(
    cmsHandoff: HtHandoffNode,
    cmsApi: FlowBuilderApi
  ): string | undefined {
    if (cmsHandoff.target?.id) {
      return cmsApi.getPayload(cmsHandoff.target)
    }

    return undefined
  }

  async doHandoff(request: ActionRequest): Promise<void> {
    const handOffBuilder = new HandOffBuilder(request.session)
    handOffBuilder.withAutoAssignOnWaiting(this.handoffAutoAssign)

    if (this.hasQueuePositionChangedNotificationsEnabled) {
      handOffBuilder.withSubscribeHelpdeskEvents([
        HelpdeskEvent.QueuePositionChanged,
      ])
    }

    if (this.onFinishPayload) {
      handOffBuilder.withOnFinishPayload(this.onFinishPayload)
    }

    if (this.queue) {
      const language = request.getSystemLocale()

      handOffBuilder.withQueue(this.queue.id)

      const { flowId, flowName, flowNodeId, flowNodeContentId } =
        getCommonFlowContentEventArgsForContentId(request, this.id)

      handOffBuilder.withBotEvent({
        flowId,
        flowName,
        flowNodeId,
        flowNodeContentId,
      })

      handOffBuilder.withExtraData({
        language,
      })

      await handOffBuilder.handOff()
    }
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    return isDev(request.session) || isWebchat(request.session) ? (
      <WebchatSettings key={id} enableUserInput={true} />
    ) : (
      <></>
    )
  }
}
