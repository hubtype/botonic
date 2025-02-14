import { isDev, isFacebook, isWebchat, isWhatsapp } from '@botonic/core'
import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { Button } from '../button'
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
  console.log('MultichannelCarousel', props)
  const requestContext = useContext(RequestContext)

  if (isDev(requestContext.session) || isWebchat(requestContext.session)) {
    return <Carousel {...props}>{props.children}</Carousel>
  }

  const messages = []
  const childrenElements = props.children.map(e => e.props.children)

  childrenElements.forEach((element, i) => {
    const {
      imageProps,
      title,
      subtitle,
      textButton,
      payloadButton,
      urlButton,
    } = extractElementProperties(element)

    const textMessage = getTextMessage(requestContext.session, title, subtitle)

    const messageWithImage = <Image src={imageProps.src} />
    messages.push(messageWithImage)

    if (urlButton && isWhatsapp(requestContext.session)) {
      const messageWithButtonUrl = (
        <WhatsappCTAUrlButton
          key={`carousel-element-${i}-cta-url`}
          body={title}
          footer={`_${subtitle}_`}
          displayText={textButton}
          url={urlButton}
        />
      )
      messages.push(messageWithButtonUrl)
    } else {
      const messageWithButtonPayload = (
        <Text key={`carousel-element-${i}-text`}>
          {textMessage}
          <Button
            key={`carousel-element-${i}-button`}
            payload={payloadButton}
            url={urlButton}
          >
            {textButton}
          </Button>
        </Text>
      )
      messages.push(messageWithButtonPayload)
    }
  })

  return <>{messages}</>
}

function getButtons(node) {
  return [].concat(getFilteredElements(node, isMultichannelButton))
}

function extractElementProperties(element) {
  let imageProps, title, subtitle
  const buttonsChildren = []

  for (const node of element) {
    if (isNodePic(node)) imageProps = node.props
    if (isNodeTitle(node)) title = node.props.children
    if (isNodeSubtitle(node)) subtitle = node.props.children
    if (isMultichannelButton(node)) buttonsChildren.push(node)
    if (Array.isArray(node)) buttonsChildren.push(...getButtons(node))
  }

  // Carousel Element only allow one button
  const textButton = buttonsChildren[0].props.children
  const payloadButton = buttonsChildren[0].props.payload
  const urlButton = buttonsChildren[0].props.url

  return { imageProps, title, subtitle, textButton, payloadButton, urlButton }
}

function getTextMessage(session, title, subtitle) {
  const textMessage = `**${title}**${subtitle ? ` _${subtitle}_` : ''}`
  return isWhatsapp(session) || isFacebook(session)
    ? convertToMarkdownMeta(textMessage)
    : textMessage
}
