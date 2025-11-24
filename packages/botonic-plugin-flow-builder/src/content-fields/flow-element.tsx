import { Button } from '@botonic/core'
import { ActionRequest, Element, Pic, Subtitle, Title } from '@botonic/react'

import { FlowBuilderApi } from '../api'
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
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowElement {
    const newElement = new FlowElement(component.id)
    newElement.title = this.getTextByLocale(locale, component.title)
    newElement.subtitle = this.getTextByLocale(locale, component.subtitle)
    newElement.image = this.getAssetByLocale(locale, component.image)
    newElement.button = FlowButton.fromHubtypeCMS(
      component.button,
      locale,
      cmsApi
    )
    return newElement
  }

  static fromAIAgent(
    id: string,
    element: {
      title: string
      subtitle: string
      image: string
      button: Button
    }
  ) {
    const newElement = new FlowElement(id)
    newElement.title = element.title
    newElement.subtitle = element.subtitle
    newElement.image = element.image
    newElement.button = FlowButton.fromAIAgent({
      id: `${id}-button`,
      text: element.button.text,
      url: element.button.url,
    })
    return newElement
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    if (this.button) {
      await this.button.trackFlow(request)
    }
  }

  toBotonic(parentId: string): JSX.Element {
    return (
      <Element key={`${parentId}-${this.id}`}>
        <Pic src={this.image} />
        <Title>{this.title}</Title>
        <Subtitle>{this.subtitle}</Subtitle>
        {this.button?.renderButton(0)}
      </Element>
    )
  }
}
