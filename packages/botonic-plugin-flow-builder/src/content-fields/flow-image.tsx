import { ActionRequest, Image } from '@botonic/react'
import React from 'react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtImageNode } from './hubtype-fields'

export class FlowImage extends ContentFieldsBase {
  public src = ''

  static fromHubtypeCMS(component: HtImageNode, locale: string): FlowImage {
    const newImage = new FlowImage(component.id)
    newImage.code = component.code
    newImage.src = this.getAssetByLocale(locale, component.content.image)
    newImage.followUp = component.follow_up

    return newImage
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string): JSX.Element {
    return <Image key={id} src={this.src} />
  }
}
