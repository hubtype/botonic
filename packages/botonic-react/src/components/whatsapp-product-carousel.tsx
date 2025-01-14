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

interface Card {
  product_retailer_id: string
  catalog_id: string
  card_index?: number
}

export interface WhatsappProductCarouselProps {
  templateName: string
  templateLanguage: string
  cards: Card[]
  bodyParameters?: Parameters[]
}

const serialize = (message: string) => {
  return { text: message }
}

export const WhatsappProductCarousel = (
  props: WhatsappProductCarouselProps
) => {
  const renderBrowser = () => {
    // Return a dummy message for browser
    const message = `WhatsApp Product Carousel would be sent to the user.`
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
        type={INPUT.WHATSAPP_PRODUCT_CAROUSEL}
      />
    )
  }

  return renderComponent({ renderBrowser, renderNode })
}
