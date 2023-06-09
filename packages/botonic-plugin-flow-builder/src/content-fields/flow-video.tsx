import { Video } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtVideoNode } from './hubtype-fields'

export class FlowVideo extends ContentFieldsBase {
  public src = ''
  public code = ''

  static fromHubtypeCMS(component: HtVideoNode, locale: string): FlowVideo {
    const newVideo = new FlowVideo(component.id)
    newVideo.code = component.code
    newVideo.src = this.getVideoByLocale(locale, component.content.video)
    return newVideo
  }

  toBotonic(id: string): JSX.Element {
    // @ts-ignore
    return <Video key={id} src={this.src} />
  }
}
