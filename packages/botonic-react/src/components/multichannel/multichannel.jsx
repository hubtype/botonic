import { isFacebook, isWhatsapp } from '@botonic/core'
import React, { useContext } from 'react'

import { RequestContext } from '../../contexts'
import { deepMapWithIndex } from '../../util/react'
import { Button } from '../button'
import { Carousel } from '../carousel'
import { Reply } from '../reply'
import { Text } from '../text'
import { MultichannelButton } from './multichannel-button'
import { MultichannelCarousel } from './multichannel-carousel'
import { MultichannelContext } from './multichannel-context'
import { MultichannelReply } from './multichannel-reply'
import { MultichannelText } from './multichannel-text'
import { MULTICHANNEL_WHATSAPP_PROPS } from './whatsapp/constants'

export const Multichannel = props => {
  const requestContext = useContext(RequestContext)
  if (
    !isWhatsapp(requestContext.session) &&
    !isFacebook(requestContext.session)
  ) {
    return props.children
  }
  if (isFacebook(requestContext.session)) {
    const newChildren = deepMapWithIndex(props.children, child => {
      if (child && child.type && child.type.name === Text.name) {
        return (
          <MultichannelText {...child.props} key={child.key}>
            {child.props.children}
          </MultichannelText>
        )
      }
      return child
    })
    return newChildren
  }

  let newChildren = deepMapWithIndex(props.children, (child, index) => {
    if (child && child.type && child.type.name === Button.name) {
      return (
        <MultichannelButton {...child.props} key={child.key}>
          {child.props.children}
        </MultichannelButton>
      )
    }
    if (child && child.type && child.type.name === Reply.name) {
      return (
        <MultichannelReply {...child.props} key={child.key}>
          {child.props.children}
        </MultichannelReply>
      )
    }
    if (child && child.type && child.type.name === Text.name) {
      return (
        <MultichannelText
          {...child.props}
          {...props.text}
          key={child.key}
          {...(props.messageSeparator &&
            index > 0 && { newline: props.messageSeparator })}
        >
          {child.props.children}
        </MultichannelText>
      )
    }
    if (child && child.type && child.type.name === Carousel.name) {
      return (
        <MultichannelCarousel
          {...child.props}
          {...props.carousel}
          key={child.key}
        >
          {child.props.children}
        </MultichannelCarousel>
      )
    }
    return child
  })
  if (props.messageSeparator != null) {
    newChildren = newChildren.map((c, index) =>
      index > 0 && typeof c === 'string' ? props.messageSeparator + c : c
    )
    newChildren = (
      <Text key={props.key} {...MULTICHANNEL_WHATSAPP_PROPS}>
        {newChildren}
      </Text>
    )
  }
  return (
    <MultichannelContext.Provider
      value={{
        currentIndex: props.firstIndex,
        boldIndex: props.boldIndex,
        indexSeparator: props.indexSeparator,
        messageSeparator: props.messageSeparator,
      }}
    >
      {newChildren}
    </MultichannelContext.Provider>
  )
}
