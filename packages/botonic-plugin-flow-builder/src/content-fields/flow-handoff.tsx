import { HandOffBuilder } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { ContentFieldsBase } from './content-fields-base'
import {
  HtCarouselNode,
  HtHandoffNode,
  HtImageNode,
  HtPayloadNode,
  HtQueueLocale,
  HtTextNode,
  HtVideoNode,
  HtWhatsappButtonListNode,
} from './hubtype-fields'

type HtAfterHandoff =
  | HtTextNode
  | HtImageNode
  | HtVideoNode
  | HtCarouselNode
  | HtWhatsappButtonListNode

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
    newHandoff.onFinishPayload = this.getOnFinishPayload(
      cmsHandoff,
      locale,
      cmsApi
    )
    newHandoff.handoffAutoAssign = cmsHandoff.content.has_auto_assign

    return newHandoff
  }

  private static getOnFinishPayload(
    cmsHandoff: HtHandoffNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): string | undefined {
    if (cmsHandoff.target?.id) {
      const handoffTargetNode = cmsApi.getNodeById<HtAfterHandoff>(
        cmsHandoff.target?.id
      )
      if (handoffTargetNode?.id) return handoffTargetNode?.id
    }

    const payloadId = cmsHandoff.content.payload.find(
      payload => payload.locale === locale
    )?.id

    if (!payloadId) return undefined

    const actionPayload = cmsApi.getNodeById(payloadId)

    return (actionPayload as HtPayloadNode).content.payload
  }

  async doHandoff(request: ActionRequest) {
    // @ts-ignore
    const handOffBuilder = new HandOffBuilder(request.session)
    handOffBuilder.withAutoAssignOnWaiting(this.handoffAutoAssign)
    if (this.onFinishPayload) {
      handOffBuilder.withOnFinishPayload(this.onFinishPayload)
    }
    if (this.queue) {
      handOffBuilder.withQueue(this.queue.id)
      await handOffBuilder.handOff()
    }
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
