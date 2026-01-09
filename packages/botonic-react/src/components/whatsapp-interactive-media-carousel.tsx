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

export enum CardType {
  CTA_URL = 'cta_url',
  QUICK_REPLY = 'quick_reply',
}

interface BaseCard {
  imageLink: string
  text: string
}

interface UrlCard extends BaseCard {
  type: CardType.CTA_URL
  action: {
    buttonText: string
    buttonUrl: string
  }
}

interface QuickReplyCard extends BaseCard {
  type: CardType.QUICK_REPLY
  action: {
    buttons: {
      text: string
      payload: string
    }[]
  }
}

export type WhatsappInteractiveMediaCard = UrlCard | QuickReplyCard
export interface WhatsappInteractiveMediaCarouselProps {
  cards: WhatsappInteractiveMediaCard[]
  textMessage: string
}

/*
  Reference: https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-media-carousel-messages?locale=en_US
*/
export const WhatsappInteractiveMediaCarousel = (
  props: WhatsappInteractiveMediaCarouselProps
) => {
  return (
    <Carousel text={truncateText(props.textMessage, WHATSAPP_MAX_BODY_CHARS)}>
      {props.cards.map((card, index) => (
        <Element key={index}>
          <Pic src={card.imageLink} />
          <Title>
            {truncateText(card.text, WHATSAPP_MAX_CAROUSEL_CARD_TEXT_CHARS)}
          </Title>
          {card.type === CardType.CTA_URL && (
            <Button url={card.action.buttonUrl}>
              {truncateText(card.action.buttonText, WHATSAPP_MAX_BUTTON_CHARS)}
            </Button>
          )}
          {card.type === CardType.QUICK_REPLY &&
            card.action.buttons.map((button, index) => (
              <Button key={index} payload={button.payload}>
                {truncateText(button.text, WHATSAPP_MAX_BUTTON_CHARS)}
              </Button>
            ))}
        </Element>
      ))}
    </Carousel>
  )
}
