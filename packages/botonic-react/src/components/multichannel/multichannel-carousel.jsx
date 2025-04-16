import { isDev, isFacebook, isWebchat, isWhatsapp } from '@botonic/core'
import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { Button } from '../button/index'
import { Carousel } from '../carousel'
import { Image } from '../image'
import { Text } from '../text'
import { WhatsappCTAUrlButton } from '../whatsapp-cta-url-button'
import {
  getFilteredElements,
  isMultichannelButton,
  isNodePic,
  isNodeSubtitle,
  isNodeTitle,
} from './multichannel-utils'
import { convertToMarkdownMeta } from './whatsapp/markdown-meta'

export const MultichannelCarousel = props => {
  const requestContext = useContext(RequestContext)

  if (isDev(requestContext.session) || isWebchat(requestContext.session)) {
    return <Carousel {...props}>{props.children}</Carousel>
  }

  const messages = []
  const childrenElements = props.children.map(e => e.props.children)

  childrenElements.forEach((element, i) => {
    const { imageProps, title, subtitle, buttons } =
      parseCarouselElement(element)

    const textMessage = getTextMessage(requestContext.session, title, subtitle)

    if (imageProps?.src) {
      const messageWithImage = <Image src={imageProps.src} />
      messages.push(messageWithImage)
    }

    if (
      isWhatsapp(requestContext.session) &&
      buttons.some(button => button.url)
    ) {
      const messageWithButtonUrl = (
        <WhatsappCTAUrlButton
          key={`carousel-element-${i}-cta-url`}
          body={title}
          footer={`_${subtitle}_`}
          displayText={buttons[0].text}
          url={buttons[0].url}
        />
      )
      messages.push(messageWithButtonUrl)
    }

    const messageWithButtons = buttons.some(button => button.payload) ? (
      <Text key={`carousel-element-${i}-text`}>
        {textMessage}
        {buttons
          .filter(button => isWhatsapp(requestContext.session) && !button.url)
          .map(button => (
            <Button
              key={`carousel-element-${i}-button`}
              payload={button.payload}
              url={button.url}
            >
              {button.text}
            </Button>
          ))}
      </Text>
    ) : (
      []
    )
    messages.push(messageWithButtons)
  })

  return <>{messages}</>
}

function getButtons(node) {
  return [].concat(getFilteredElements(node, isMultichannelButton))
}

function parseCarouselElement(element) {
  let imageProps, title, subtitle
  const buttonsChildren = []

  for (const node of element) {
    if (isNodePic(node)) imageProps = node.props
    if (isNodeTitle(node)) title = node.props.children
    if (isNodeSubtitle(node)) subtitle = node.props.children
    if (isMultichannelButton(node)) buttonsChildren.push(node)
    if (Array.isArray(node)) buttonsChildren.push(...getButtons(node))
  }

  const buttons = buttonsChildren.map(button => {
    return {
      text: button.props.children,
      payload: button.props.payload,
      url: button.props.url,
    }
  })

  return { imageProps, title, subtitle, buttons }
}

function getTextMessage(session, title, subtitle) {
  const formattedTextMessage = `**${title}**${subtitle ? ` _${subtitle}_` : ''}`
  return isWhatsapp(session) || isFacebook(session)
    ? convertToMarkdownMeta(formattedTextMessage)
    : formattedTextMessage
}
