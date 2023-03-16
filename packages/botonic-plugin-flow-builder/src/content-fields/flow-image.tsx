import { Image } from '@botonic/react'
import React from 'react'

import { ImageNode } from '../flow-builder-models'
import { ContentFieldsBase } from './content-fields-base'

export class FlowImage extends ContentFieldsBase {
  public src = ''
  public code = ''

  static fromHubtypeCMS(component: ImageNode, locale: string): FlowImage {
    const newImage = new FlowImage(component.id)
    newImage.code = component.code
    newImage.src = this.getImageByLocale(locale, component.content.image)
    return newImage
  }

  toBotonic(index: number): JSX.Element {
    return <Image src={this.src} key={index} />
  }
}
