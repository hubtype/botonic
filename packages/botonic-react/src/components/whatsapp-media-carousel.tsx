import { INPUT } from '@botonic/core'
import React from 'react'

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
    fallback_value: string
    code: string
    amount_1000: number
  }
}

interface DateTimeParameter {
  type: 'date_time'
  date_time: { fallback_value: string }
}

type CardButton = QuickReplyButton | UrlButton

interface Button {
  type: 'quick_reply' | 'url'
  button_index?: number
}

interface QuickReplyButton extends Button {
  payload: string
}

interface UrlButton extends Button {
  url_variable: string
}

interface Card {
  file_type: 'image' | 'video'
  file_id: string
  card_index?: number
  body_parameters?: Parameters[]
  buttons?: CardButton[]
  extra_components?: Record<string, any>[]
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
      if (!card.card_index) {
        card.card_index = index
      }
      card.buttons?.forEach((button, index) => {
        if (!button.button_index) {
          button.button_index = index
        }
      })
    })
    return cards
  }

  const renderNode = () => {
    return (
      // @ts-ignore Property 'message' does not exist on type 'JSX.IntrinsicElements'.
      <message
        {...props}
        bodyParameters={JSON.stringify(props.bodyParameters)}
        cards={JSON.stringify(getCards(props.cards))}
        templateName={props.templateName}
        templateLanguage={props.templateLanguage}
        type={INPUT.WHATSAPP_MEDIA_CAROUSEL}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
