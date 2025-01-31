import { HandOffBuilder, HelpdeskEvent, isDev, isWebchat } from '@botonic/core'
import {
  ActionRequest,
  Multichannel,
  Text,
  WebchatSettings,
} from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { ContentFieldsBase } from './content-fields-base'
import { HtHandoffNode, HtQueueLocale } from './hubtype-fields'

export class FlowHandoff extends ContentFieldsBase {
  public code: string
  public queue?: HtQueueLocale
  public onFinishPayload?: string
  public handoffAutoAssign: boolean
  public hasInitialQueuePositionEnabled: boolean
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
    newHandoff.hasInitialQueuePositionEnabled =
      cmsHandoff.content.has_initial_queue_position_enabled
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

    if (this.hasInitialQueuePositionEnabled) {
      handOffBuilder.withSubscribeHelpdeskEvents([
        HelpdeskEvent.InitialQueuePosition,
      ])
    }

    if (this.onFinishPayload) {
      handOffBuilder.withOnFinishPayload(this.onFinishPayload)
    }

    if (this.queue) {
      const language = request.session.user.extra_data.language
      const country = request.session.user.extra_data.country

      handOffBuilder.withQueue(this.queue.id)
      handOffBuilder.withBotEvent({
        language,
        country,
      })
      handOffBuilder.withExtraData({
        language,
      })
      this.isTestIntegration = request.session.is_test_integration
      await handOffBuilder.handOff()
    }
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (this.isTestIntegration) {
      return (
        <Multichannel key={this.id}>
          <Text>
            _**HANDOFF IN PREVIEW**_ {'\n'}ℹ️ _At this point, a new case would
            be created in {this.queue?.name} queue. To continue with the
            preview, a case resolved scenario will be simulated._
          </Text>
        </Multichannel>
      )
    }

    return isDev(request.session) || isWebchat(request.session) ? (
      <WebchatSettings key={id} enableUserInput={true} />
    ) : (
      <></>
    )
  }
}
