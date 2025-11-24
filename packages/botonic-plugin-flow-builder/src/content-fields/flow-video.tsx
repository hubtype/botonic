import { ActionRequest, Video } from '@botonic/react'
import React from 'react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtVideoNode } from './hubtype-fields'

export class FlowVideo extends ContentFieldsBase {
  public src = ''

  static fromHubtypeCMS(component: HtVideoNode, locale: string): FlowVideo {
    const newVideo = new FlowVideo(component.id)
    newVideo.code = component.code
    newVideo.src = this.getVideoByLocale(locale, component.content.video)
    newVideo.followUp = component.follow_up

    return newVideo
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string): JSX.Element {
    return <Video key={id} src={this.src} />
  }
}
