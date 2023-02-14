import { Image } from '@botonic/react'
import React from 'react'

import { HtImageNode } from '../hubtype-models'
import { getImageByLocale } from '../utils'
import { ContentFieldsBase } from './content-base'

export class FlowImage extends ContentFieldsBase {
  public src = ''
  public code = ''

  static fromHubtypeCMS(component: HtImageNode, locale: string): FlowImage {
    const newImage = new FlowImage(component.id)
    newImage.code = component.code
    newImage.src = getImageByLocale(locale, component.content.image)
    return newImage
  }

  toBotonic(index: number) {
    return <Image src={this.src} key={index} />
  }
}
