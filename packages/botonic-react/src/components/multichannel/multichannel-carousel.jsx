import { isDev, isWebchat, isWhatsapp } from '@botonic/core'
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

export const MultichannelCarousel = props => {
  console.log('MultichannelCarousel', props)
  const requestContext = useContext(RequestContext)

  const getButtons = node => {
    return [].concat(getFilteredElements(node, isMultichannelButton))
  }

  if (isDev(requestContext.session) || isWebchat(requestContext.session)) {
    return <Carousel {...props}>{props.children}</Carousel>
  }

  const messages = []
  const elements = props.children
    .map(e => e.props.children)
    .map((element, i) => {
      let imageProps = undefined
      let title = undefined
      let subtitle = undefined
      const buttonsChildren = []

      for (const node of element) {
        if (isNodePic(node)) {
          imageProps = node.props
        }
        if (isNodeTitle(node)) {
          title = node.props.children
        }
        if (isNodeSubtitle(node)) {
          subtitle = node.props.children
        }

        console.log('node', node)
        if (isMultichannelButton(node)) {
          buttonsChildren.push(node)
        }
        //TODO support fragment containing an array
        if (Array.isArray(node)) {
          buttonsChildren.push(getButtons(node))
        }
      }

      const messageWithImage = <Image src={imageProps.src} />
      messages.push(messageWithImage)

      const messageText = `*${title}*${subtitle ? ` _${subtitle}_` : ''}`

      const displayText = buttonsChildren[0].props.children
      const payload = buttonsChildren[0].props.payload
      const url = buttonsChildren[0].props.url

      if (url && isWhatsapp(requestContext.session)) {
        const messageWithButtonUrl = (
          <WhatsappCTAUrlButton
            body={messageText}
            displayText={displayText}
            url={url}
          />
        )
        messages.push(messageWithButtonUrl)
      } else {
        const buttons = buttonsChildren.map((button, j) => {
          return (
            <Button key={`carousel-element-${i}-button${j}`} payload={payload}>
              {displayText}
            </Button>
          )
        })

        const messageWithButtonPayload = (
          <Text key={`carousel-element-${i}-text`}>
            {messageText}
            {buttons}
          </Text>
        )
        messages.push(messageWithButtonPayload)
      }

      return element
    })

  return <>{messages}</>
}
