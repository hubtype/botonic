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
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtCarouselNode } from './hubtype-fields'

const DEFAULT_TEXT_MESSAGE = 'These are the options'
export class FlowCarousel extends ContentFieldsBase {
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
    newCarousel.followUp = component.follow_up

    return newCarousel
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
    for (const element of this.elements) {
      await element.trackFlow(request)
    }
  }

  static areElementsValidForWhatsapp = (carouselMessage: CarouselMessage) => {
    const isValid = carouselMessage.content.elements.every(
      element => element.button.url
    )

    if (!isValid) {
      console.warn(
        'Cannot use WhatsappInteractiveMediaCarousel for Whatsapp created by AIAgent',
        carouselMessage.content
      )
    }
    return isValid
  }

  static generateWhatsappElementText(element: {
    title: string
    subtitle?: string
  }): string {
    if (element.subtitle) {
      return `*${element.title}*\n${element.subtitle}`
    }
    return element.title
  }

  static fromAIAgent(
    id: string,
    carouselMessage: CarouselMessage,
    request: ActionRequest
  ): JSX.Element {
    if (
      isWhatsapp(request.session) &&
      FlowCarousel.areElementsValidForWhatsapp(carouselMessage)
    ) {
      if (carouselMessage.content.elements.length === 1) {
        const element = carouselMessage.content.elements[0]
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
            const text = FlowCarousel.generateWhatsappElementText(element)

            return {
              text,
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

  private toCarouselMessage(elements: FlowElement[]): CarouselMessage {
    return {
      type: 'carousel',
      content: {
        elements: elements.map(element => {
          return {
            button: {
              text: element.button?.text || '',
              payload: element.button?.payload,
              url: element.button?.url,
            },
            title: element.title,
            subtitle: element.subtitle,
            image: element.image,
          }
        }),
      },
    }
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    const carouselMessage = this.toCarouselMessage(this.elements)
    if (
      isWhatsapp(request.session) &&
      FlowCarousel.areElementsValidForWhatsapp(carouselMessage)
    ) {
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
            const text = FlowCarousel.generateWhatsappElementText(element)
            const buttonText = element.button!.text!
            const buttonUrl = element.button!.url!
            const imageLink = element.image!

            return {
              text,
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
