import { Image } from '@botonic/react'
import React from 'react'

import { HtImageNode } from '../hubtype-models'
import { ContentFieldsBase } from './content-base'

export class FlowImage extends ContentFieldsBase {
  public src = ''
  public code = ''

  static fromHubtypeCMS(component: HtImageNode, locale: string): FlowImage {
    const newImage = new FlowImage(component.id)
    newImage.code = component.code
    newImage.src = this.getImageByLocale(locale, component.content.image)
    return newImage
  }

  toBotonic(index: number) {
    return <Image src={this.src} key={index} />
  }
}
