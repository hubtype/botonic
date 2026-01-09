import { CarouselMessage, isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Button,
  CardType,
  Carousel,
  Text,
  WhatsappCTAUrlButton,
  WhatsappCTAUrlHeaderType,
  WhatsappInteractiveMediaCard,
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
  public whatsappText: string = ''
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
    newCarousel.whatsappText = this.getTextByLocale(
      locale,
      component.content.whatsapp_text
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
    const isValid =
      carouselMessage.content.elements.every(element => element.button.url) ||
      carouselMessage.content.elements.every(element => element.button.payload)

    if (!isValid) {
      console.warn(
        'Cannot use WhatsappInteractiveMediaCarousel for Whatsapp created by AIAgent, all elements must have either url or payload.',
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

  private static createCardsFromElements(
    elements: FlowElement[]
  ): WhatsappInteractiveMediaCard[] {
    return elements.map(element => {
      const text = FlowCarousel.generateWhatsappElementText(element)

      if (element.button?.url) {
        return {
          imageLink: element.image,
          text,
          type: CardType.CTA_URL as const,
          action: {
            buttonText: element.button.text,
            buttonUrl: element.button.url,
          },
        }
      }
      if (element.button?.payload) {
        return {
          imageLink: element.image,
          text,
          type: CardType.QUICK_REPLY as const,
          action: {
            buttons: [
              {
                text: element.button.text,
                payload: element.button.payload,
              },
            ],
          },
        }
      }
      throw new Error('Element must have a url or a payload')
    })
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
      if (
        carouselMessage.content.elements.length === 1 &&
        carouselMessage.content.elements[0].button?.url
      ) {
        const element = carouselMessage.content.elements[0]
        const buttonText = element.button.text
        const url = carouselMessage.content.elements[0].button.url
        // TODO: Add a new fromAIAgent method in FlowWhatsappCtaUrlButtonNode to create a WhatsappCTAUrlButton from an AIAgent message
        return (
          <WhatsappCTAUrlButton
            key={id}
            body={element.title}
            headerType={WhatsappCTAUrlHeaderType.Image}
            headerImage={element.image}
            footer={element.subtitle}
            displayText={buttonText}
            url={url}
          />
        )
      }

      if (
        carouselMessage.content.elements.length === 1 &&
        carouselMessage.content.elements[0].button?.payload
      ) {
        const element = carouselMessage.content.elements[0]
        const text = FlowCarousel.generateWhatsappElementText(element)
        const buttonPayload = carouselMessage.content.elements[0].button.payload
        const buttonText = carouselMessage.content.elements[0].button.text

        return (
          <Text>
            {text}
            <Button payload={buttonPayload}>{buttonText}</Button>
          </Text>
        )
      }

      const elements = carouselMessage.content.elements.map((element, index) =>
        FlowElement.fromAIAgent(`${id}-element-${index}`, element)
      )
      return (
        <WhatsappInteractiveMediaCarousel
          cards={FlowCarousel.createCardsFromElements(elements)}
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
      if (this.elements.length === 1 && this.elements[0].button?.url) {
        const element = this.elements[0]
        const buttonText = this.elements[0].button.text
        const url = this.elements[0].button.url

        return (
          <WhatsappCTAUrlButton
            key={id}
            body={element.title}
            headerType={WhatsappCTAUrlHeaderType.Image}
            headerImage={element.image}
            displayText={buttonText}
            url={url}
          />
        )
      }

      if (
        this.elements.length === 1 &&
        this.elements[0].button &&
        this.elements[0].button?.payload
      ) {
        const element = this.elements[0]
        const text = FlowCarousel.generateWhatsappElementText(element)
        const buttonPayload = this.elements[0].button.payload
        const buttonText = this.elements[0].button.text

        return (
          <Text>
            {text}
            <Button payload={buttonPayload}>{buttonText}</Button>
          </Text>
        )
      }

      return (
        <WhatsappInteractiveMediaCarousel
          cards={FlowCarousel.createCardsFromElements(this.elements)}
          // TODO: Add the text message in flow builder frontend and take it from the carousel node with different languages
          textMessage={this.whatsappText || DEFAULT_TEXT_MESSAGE}
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
