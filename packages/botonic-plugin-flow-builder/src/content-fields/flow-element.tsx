import { Element, Pic, Subtitle, Title } from '@botonic/react'
import React from 'react'

import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { HtCarouselElement } from './hubtype-fields'

export class FlowElement extends ContentFieldsBase {
  public title = ''
  public subtitle = ''
  public button: FlowButton | undefined
  public image = ''
  public hidden = false

  static fromHubtypeCMS(
    component: HtCarouselElement,
    locale: string
  ): FlowElement {
    const newElement = new FlowElement(component.id)
    newElement.title = this.getTextByLocale(locale, component.title)
    newElement.subtitle = this.getTextByLocale(locale, component.subtitle)
    newElement.image = this.getImageByLocale(locale, component.image)
    newElement.button = FlowButton.fromHubtypeCMS(component.button, locale)
    return newElement
  }

  toBotonic(parentId: string): JSX.Element {
    return (
      <Element key={`${parentId}-${this.id}`}>
        <Pic src={this.image} />
        <Title>{this.title}</Title>
        <Subtitle>{this.subtitle}</Subtitle>
        {this.button?.renderButton()}
      </Element>
    )
  }
}
