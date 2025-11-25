import React from 'react'

import { truncateText } from '../util'
import { Button } from './button'
import { Carousel } from './carousel'
import { Element } from './element'
import {
  WHATSAPP_MAX_BODY_CHARS,
  WHATSAPP_MAX_BUTTON_CHARS,
  WHATSAPP_MAX_CAROUSEL_CARD_TEXT_CHARS,
} from './multichannel/whatsapp/constants'
import { Pic } from './pic'
import { Title } from './title'

interface ActionCard {
  buttonText: string
  buttonUrl: string
  imageLink: string
}

interface Card {
  text: string
  action: ActionCard
}

export interface WhatsappInteractiveMediaCarouselProps {
  cards: Card[]
  textMessage: string
}

/*
  Reference: https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-media-carousel-messages/
*/
export const WhatsappInteractiveMediaCarousel = (
  props: WhatsappInteractiveMediaCarouselProps
) => {
  return (
    <Carousel text={truncateText(props.textMessage, WHATSAPP_MAX_BODY_CHARS)}>
      {props.cards.map((card, index) => (
        <Element key={index}>
          <Pic src={card.action.imageLink} />
          <Title>
            {truncateText(card.text, WHATSAPP_MAX_CAROUSEL_CARD_TEXT_CHARS)}
          </Title>
          <Button url={card.action.buttonUrl}>
            {truncateText(card.action.buttonText, WHATSAPP_MAX_BUTTON_CHARS)}
          </Button>
        </Element>
      ))}
    </Carousel>
  )
}
