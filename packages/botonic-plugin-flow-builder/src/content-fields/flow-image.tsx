import { Image } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { HtImageNode } from './hubtype-fields'

export class FlowImage extends ContentFieldsBase {
  public src = ''
  public code = ''

  static fromHubtypeCMS(component: HtImageNode, locale: string): FlowImage {
    const newImage = new FlowImage(component.id)
    newImage.code = component.code
    newImage.src = this.getAssetByLocale(locale, component.content.image)
    return newImage
  }

  toBotonic(id: string): JSX.Element {
    return <Image key={id} src={this.src} />
  }
}
