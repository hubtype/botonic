import {
  type BotContext,
  HandOffBuilder,
  HelpdeskEvent,
  isDev,
  isWebchat,
} from '@botonic/core'
import { WebchatSettings } from '@botonic/react'

import type { FlowBuilderApi } from '../api'
import { getCommonFlowContentEventArgsForContentId } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtHandoffNode, HtQueueLocale } from './hubtype-fields'

export class FlowHandoff extends ContentFieldsBase {
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
    newHandoff.queue = FlowHandoff.getQueueByLocale(
      locale,
      cmsHandoff.content.queue
    )
    newHandoff.onFinishPayload = FlowHandoff.getOnFinishPayload(
      cmsHandoff,
      cmsApi
    )
    newHandoff.handoffAutoAssign = cmsHandoff.content.has_auto_assign
    newHandoff.hasQueuePositionChangedNotificationsEnabled =
      cmsHandoff.content.has_queue_position_changed_notifications_enabled
    newHandoff.followUp = cmsHandoff.follow_up

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

  async doHandoff(botContext: BotContext): Promise<void> {
    const handOffBuilder = new HandOffBuilder(botContext.session)
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
      const language = botContext.getSystemLocale()

      handOffBuilder.withQueue(this.queue.id)

      const { flowId, flowName, flowNodeId, flowNodeContentId } =
        getCommonFlowContentEventArgsForContentId(botContext, this.id)

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_botContext: BotContext): Promise<void> {
    // TODO: Not apply for this content because backend track handoff success event
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.doHandoff(botContext)
    return
  }

  toBotonic(botContext: BotContext): JSX.Element {
    return isDev(botContext.session) || isWebchat(botContext.session) ? (
      <WebchatSettings key={this.id} enableUserInput={true} />
    ) : (
      <></>
    )
  }
}
