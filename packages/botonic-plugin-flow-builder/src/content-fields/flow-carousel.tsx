import { CarouselMessage, isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Carousel,
  WhatsappCTAUrlButton,
  WhatsappCTAUrlHeaderType,
  WhatsappInteractiveMediaCarousel,
} from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtCarouselNode } from './hubtype-fields'

const DEFAULT_TEXT_MESSAGE = 'These are the options'
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

  static fromAIAgent(
    id: string,
    carouselMessage: CarouselMessage,
    request: ActionRequest
  ): JSX.Element {
    const areAllButtonsValid = () => {
      const isValid =
        !carouselMessage.content.elements.some(
          element => element.button.payload
        ) &&
        carouselMessage.content.elements.every(element => element.button.url)

      if (!isValid) {
        console.warn(
          'Cannot use WhatsappInteractiveMediaCarousel for Whatsapp created by AIAgent',
          carouselMessage.content
        )
      }
      return isValid
    }

    if (isWhatsapp(request.session) && areAllButtonsValid()) {
      if (carouselMessage.content.elements.length === 1) {
        const element = carouselMessage.content.elements[0]
        console.log('displaying whatsapp cta url button with element', element)
        // TODO: Add a new fromAIAgent method in FlowWhatsappCtaUrlButtonNode to create a WhatsappCTAUrlButton from an AIAgent message
        return (
          <WhatsappCTAUrlButton
            key={id}
            body={element.title}
            headerType={WhatsappCTAUrlHeaderType.Image}
            headerImage={element.image}
            footer={element.subtitle}
            displayText={element.button.text}
            url={element.button.url!}
          />
        )
      }

      return (
        <WhatsappInteractiveMediaCarousel
          cards={carouselMessage.content.elements.map(element => {
            const buttonText = element.button.text
            const buttonUrl = element.button.url!
            const imageLink = element.image

            return {
              text: `*${element.title}*\n${element.subtitle}`,
              action: { buttonText, buttonUrl, imageLink },
            }
          })}
          textMessage={carouselMessage.content.text || DEFAULT_TEXT_MESSAGE}
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
      // TODO: Improve this logic to ensure what to do if the buttons are not CTA URL buttons
      if (this.elements.length === 1) {
        const element = this.elements[0]

        return (
          <WhatsappCTAUrlButton
            key={id}
            body={element.title}
            headerType={WhatsappCTAUrlHeaderType.Image}
            headerImage={element.image}
            displayText={element.button!.text}
            url={element.button!.url!}
          />
        )
      }

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
          // TODO: Add the text message in flow builder frontend and take it from the carousel node with different languages
          textMessage={DEFAULT_TEXT_MESSAGE}
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
