import { HandOffBuilder } from '@botonic/core'
import { ActionRequest, WebchatSettings } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import {
  AvailabilityData,
  getQueueAvailability,
} from '../functions/conditional-queue-status'
import { EventAction, trackEvent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtHandoffNode, HtQueueLocale } from './hubtype-fields'

export class FlowHandoff extends ContentFieldsBase {
  public code: string
  public queue?: HtQueueLocale
  public onFinishPayload?: string
  public handoffAutoAssign: boolean

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
    // @ts-ignore
    const handOffBuilder = new HandOffBuilder(request.session)
    handOffBuilder.withAutoAssignOnWaiting(this.handoffAutoAssign)
    if (this.onFinishPayload) {
      handOffBuilder.withOnFinishPayload(this.onFinishPayload)
    }
    if (this.queue) {
      const availabilityData = await getQueueAvailability(this.queue.id)
      await this.trackHandoff(availabilityData, request, this.queue)

      handOffBuilder.withQueue(this.queue.id)
      await handOffBuilder.handOff()
    }
  }

  private async trackHandoff(
    availabilityData: AvailabilityData,
    request: ActionRequest,
    queue: HtQueueLocale
  ) {
    const eventArgs = {
      queueId: queue.id,
      queueName: queue.name,
      //caseId: 'handoffCaseIdTest', // de on surt?
      isQueueOpen: availabilityData.open,
      isAvailableAgent: availabilityData.available_agents > 0,
      isThresholdReached:
        availabilityData.availability_threshold_waiting_cases > 0,
    }
    const eventName = availabilityData.open
      ? EventAction.handoffSuccess
      : EventAction.handoffFail
    await trackEvent(request, eventName, eventArgs)
  }

  toBotonic(): JSX.Element {
    return <WebchatSettings enableUserInput={true} />
  }
}
