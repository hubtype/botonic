import { INPUT } from '@botonic/core'
import React from 'react'

import { toSnakeCaseKeys } from '../util/functional'
import { renderComponent } from '../util/react'
import { Message } from './message'

type Parameters = TextParameter | CurrencyParameter | DateTimeParameter

interface TextParameter {
  type: 'text'
  text: string
}

interface CurrencyParameter {
  type: 'currency'
  currency: {
    fallbackValue: string
    code: string
    amount1000: number
  }
}

interface DateTimeParameter {
  type: 'date_time'
  dateTime: { fallbackValue: string }
}

type CardButton = QuickReplyButton | UrlButton

interface Button {
  type: 'quick_reply' | 'url'
  buttonIndex?: number
}

interface QuickReplyButton extends Button {
  payload: string
}

interface UrlButton extends Button {
  urlVariable: string
}

interface Card {
  fileType: 'image' | 'video'
  fileId: string
  cardIndex?: number
  bodyParameters?: Parameters[]
  buttons?: CardButton[]
  extraComponents?: Record<string, any>[]
}

export interface WhatsappMediaCarouselProps {
  templateName: string
  templateLanguage: string
  cards: Card[]
  bodyParameters?: Parameters[]
}

const serialize = (message: string) => {
  return { text: message }
}

export const WhatsappMediaCarousel = (props: WhatsappMediaCarouselProps) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `WhatsApp Media Carousel would be sent to the user.`
    return (
      <Message json={serialize(message)} {...props} type={INPUT.TEXT}>
        {message}
      </Message>
    )
  }

  const getCards = (cards: Card[]) => {
    cards.forEach((card, index) => {
      if (!card.cardIndex) {
        card.cardIndex = index
      }
      card.buttons?.forEach((button, index) => {
        if (!button.buttonIndex) {
          button.buttonIndex = index
        }
      })
    })
    return toSnakeCaseKeys(cards)
  }

  const renderNode = () => {
    return (
      // @ts-ignore Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...props}
        bodyParameters={JSON.stringify(toSnakeCaseKeys(props.bodyParameters))}
        cards={JSON.stringify(getCards(props.cards))}
        templateName={props.templateName}
        templateLanguage={props.templateLanguage}
        type={INPUT.WHATSAPP_MEDIA_CAROUSEL}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
