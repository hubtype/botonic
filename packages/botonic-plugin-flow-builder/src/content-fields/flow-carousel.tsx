import { CarouselMessage, isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Carousel,
  WhatsappInteractiveMediaCarousel,
} from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtCarouselNode } from './hubtype-fields'

export class FlowCarousel extends ContentFieldsBase {
  public code = ''
  public elements: FlowElement[] = []

  static fromHubtypeCMS(
    component: HtCarouselNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowCarousel {
    const newCarousel = new FlowCarousel(component.id)
    newCarousel.code = component.code
    newCarousel.elements = component.content.elements.map(element =>
      FlowElement.fromHubtypeCMS(element, locale, cmsApi)
    )
    return newCarousel
  }

  static fromAiAgent(
    id: string,
    carouselMessage: CarouselMessage,
    request: ActionRequest
  ): JSX.Element {
    if (isWhatsapp(request.session)) {
      return (
        <WhatsappInteractiveMediaCarousel
          cards={carouselMessage.content.elements.map(element => {
            const buttonText = element.button.text
            const buttonUrl = element.button.url || ''
            const imageLink = element.image

            return {
              text: element.title,
              action: { buttonText, buttonUrl, imageLink },
            }
          })}
          textMessage={carouselMessage.content.text || ''}
        />
      )
    }
    return (
      <Carousel key={id}>
        {carouselMessage.content.elements.map((element, index) =>
          FlowElement.fromAIAgent(`${id}-element-${index}`, element).toBotonic(
            id
          )
        )}
      </Carousel>
    )
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (isWhatsapp(request.session)) {
      return (
        <WhatsappInteractiveMediaCarousel
          cards={this.elements.map(element => {
            const buttonText = element.button?.text || ''
            const buttonUrl = element.button?.url || ''
            const imageLink = element.image || ''

            return {
              text: element.title,
              action: { buttonText, buttonUrl, imageLink },
            }
          })}
          textMessage={'These are the options'} // TODO: Add the text message in flow builder frontend and take it from the carousel node with different languages
        />
      )
    }
    return (
      <Carousel key={id}>
        {this.elements.map(element => element.toBotonic(id))}
      </Carousel>
    )
  }
}
